// src/test/test.controller.ts

import {
  Controller,
  Get,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { NotificationGateway } from '../services/notification.gateway';

/**
 * TestController
 * This controller provides REST endpoints specifically for testing WebSocket functionality.
 * It allows triggering notifications from the backend for frontend clients to receive.
 */
@Controller('test') // Base route for this controller will be /test
export class NotificationController {
  constructor(private readonly notificationGateway: NotificationGateway) { }

  /**
   * Handles GET requests to /test/broadcast-notification.
   * This endpoint simulates a backend service triggering a new notification.
   * It takes optional query parameters for recipient roles and IDs to test room functionality.
   *
   * @param message The notification message (default: 'This is a test notification from the backend!').
   * @param roles Comma-separated list of recipient roles (e.g., 'admin,user').
   * @param ids Comma-separated list of recipient user IDs (e.g., 'user1,user2').
   * @returns A confirmation message that the notification was sent.
   */
  @Get('broadcast-notification')
  triggerTestNotification(
    @Query('message') message?: string,
    @Query('roles') roles?: string,
    @Query('ids') ids?: string,
  ): string {
    // Parse roles from comma-separated string to an array
    const recipientRoles = roles
      ? roles
        .split(',')
        .map((role) => role.trim())
        .filter(Boolean)
      : ['admin', 'test-room-role'];
    // Parse IDs from comma-separated string to an array
    const recipientIds = ids
      ? ids
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
      : ['123', 'test-user-id'];

    const testNotification = {
      message: message || 'This is a test notification from the backend!',
      timestamp: new Date().toISOString(),
      recipientRoles: recipientRoles,
      recipientIds: recipientIds,
      data: {
        source: 'TestController',
        triggeredBy: 'HTTP_GET_Request',
      },
    };


    this.notificationGateway.broadcastNotification(testNotification);

    return `Test notification sent! Message: "${testNotification.message}", Roles: [${recipientRoles.join(', ')}], IDs: [${recipientIds.join(', ')}]`;
  }

  /**
   * Optional: An endpoint to test sending a simple message back to the client
   * if you were to add a @SubscribeMessage handler in your gateway.
   * This is just an example and not directly used by the current frontend test setup,
   * but shows how you might trigger a direct client message from a REST endpoint.
   *
   * @param clientId The ID of the client socket to send the message to.
   * @param message The message to send.
   */
  @Get('send-to-client')
  sendToSpecificClient(
    @Query('clientId') clientId: string,
    @Query('message') message: string,
  ): string {
    if (!clientId || !message) {
      throw new HttpException(
        'Client ID and message are required.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Assuming you have a way to get the socket instance by ID in your gateway
    // This example directly uses server.to(clientId).emit, which works if clientId is a socket ID
    // For more complex scenarios, you might need to manage connected sockets in your gateway
    this.notificationGateway.server
      .to(clientId)
      .emit('messageFromServer', `Direct message from backend: ${message}`);
    console.log(
      `[TestController] Sent direct message to client ${clientId}: ${message}`,
    );
    return `Direct message sent to client ${clientId}: "${message}"`;
  }
}
