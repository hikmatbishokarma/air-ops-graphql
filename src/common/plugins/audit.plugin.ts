// src/common/plugins/audit.plugin.ts
import { Schema } from 'mongoose';

export function auditPlugin(schema: Schema) {
  schema.add({
    createdBy: { type: Schema.Types.ObjectId, ref: 'CrewDetailEntity' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'CrewDetailEntity' },
  });

  // This hook handles 'save' for new documents
  schema.pre('save', function (next) {
    console.log('plugin:::::', this);
    // Check if the document is new
    if (this.isNew) {
      // @ts-ignore
      this.createdBy = this.createdBy;
    }
    // @ts-ignore
    this.updatedBy = this.userId;
    next();
  });

  // This hook handles findOneAndUpdate, updateOne, updateMany, etc.
  schema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function (next) {
    // @ts-ignore
    this.set({ updatedBy: this.userId });
    next();
  });
}
