import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IntimationEntity, IntimationDocument } from '../entities/intimation.entity';
import { CreateIntimationInput, UpdateIntimationInput } from '../dto/intimation.dto';
import { MailerService } from 'src/notification/services/mailer.service';
import { ConfigService } from '@nestjs/config';
import { APDTemplate } from 'src/notification/templates/intimation/apd.template';
import { ATCTemplate } from 'src/notification/templates/intimation/atc.template';
import {
    TerminalTemplate,
    ReFuelTemplate,
    CISFTemplate,
    AirportOperatorTemplate,
    GroundHandlerTemplate,
} from 'src/notification/templates/intimation/common.templates';

@Injectable()
export class IntimationService {
    private readonly cloudFrontUrl: string;

    constructor(
        @InjectModel(IntimationEntity.name)
        private readonly intimationModel: Model<IntimationDocument>,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {
        this.cloudFrontUrl = this.configService.get<string>('s3.aws_cloudfront_base_url');
    }

    async createIntimation(input: CreateIntimationInput, userId: string) {
        const intimation = new this.intimationModel({
            ...input,
            status: 'DRAFT',
            sentBy: userId,
        });

        return await intimation.save();
    }

    async updateIntimation(id: string, input: UpdateIntimationInput) {
        const intimation = await this.intimationModel.findByIdAndUpdate(
            id,
            { $set: input },
            { new: true },
        );

        if (!intimation) {
            throw new NotFoundException(`Intimation with ID ${id} not found`);
        }

        return intimation;
    }

    async getIntimationsBySector(tripId: string, sectorNo: number) {
        return await this.intimationModel.find({ tripId, sectorNo }).sort({ createdAt: -1 });
    }

    async getIntimationsByTrip(tripId: string) {
        return await this.intimationModel.find({ tripId }).sort({ sectorNo: 1, createdAt: -1 });
    }

    async deleteIntimation(id: string) {
        const result = await this.intimationModel.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundException(`Intimation with ID ${id} not found`);
        }
        return true;
    }

    async sendIntimation(intimationId: string, userId: string) {
        const intimation = await this.intimationModel.findById(intimationId);

        if (!intimation) {
            throw new NotFoundException(`Intimation with ID ${intimationId} not found`);
        }

        try {
            // Get email template based on recipient type
            const htmlContent = this.getEmailTemplate(intimation.recipientType, {
                tripId: intimation.tripId,
                sectorNo: intimation.sectorNo,
                note: intimation.note,
            });

            // Prepare attachments - use CloudFront URL directly as path
            let attachments = [];
            if (intimation.attachmentUrl) {
                attachments = [
                    {
                        filename: 'intimation-letter.pdf',
                        path: intimation.attachmentUrl, // CloudFront URL can be used directly
                    },
                ];
            }

            // Send email using MailerService
            const result = await this.mailerService.sendEmail(
                intimation.toEmail,
                intimation.subject,
                '', // text content (optional)
                htmlContent,
                attachments,
            );

            if (result.success) {
                // Update intimation status
                intimation.status = 'SENT';
                intimation.sentAt = new Date();
                intimation.sentBy = userId;
                await intimation.save();
            } else {
                intimation.status = 'FAILED';
                intimation.errorMessage = result.message;
                await intimation.save();
            }

            return intimation;
        } catch (error) {
            // Update intimation status to failed
            intimation.status = 'FAILED';
            intimation.errorMessage = error.message;
            await intimation.save();
            throw error;
        }
    }

    private getEmailTemplate(recipientType: string, data: any): string {
        const templates = {
            'APD': APDTemplate,
            'ATC': ATCTemplate,
            'Terminal': TerminalTemplate,
            'Re Fuel': ReFuelTemplate,
            'CISF': CISFTemplate,
            'Airport Operator': AirportOperatorTemplate,
            'Ground Handler': GroundHandlerTemplate,
        };

        const template = templates[recipientType];
        if (!template) {
            throw new BadRequestException(`No template found for recipient type: ${recipientType}`);
        }

        return template(data);
    }
}
