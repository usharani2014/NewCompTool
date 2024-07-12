import mongoose from "mongoose";

const RbiReturnSchema = new mongoose.Schema({
  financial_year: {
    type: Number,
    required:true,
  },
  internal_system_number: {
      type: Number,
      unique: true
  },
  SNo: {
    type: String,
    required: true,
  },
  description: { 
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  concerned_department: {
    type: String,
    required: true,
  },
  reporting_entity: {
    type: String,
    required: true,
  },
  circulars: {
    type: String,
    required: true,
  },
  due_date: {
    type: Date,
  },
  filling_date:{
    type: Date
  },
  delay: {
    type: Number,
  },
  filed_delay:{
    type: Boolean
  },
  approval: {
    type: Boolean,
  },
  remarks:{
    type: String
  }
  },
  { timestamps: true }
);

yourSchema.pre('save', function(next) {
    const doc = this;
    if (!doc.internal_system_number) {
      doc.constructor.countDocuments({}, function(err, count) {
        if (err) {
          return next(err);
        }
        doc.internal_system_number = count + 1000;
        next();
      });
    } else {
      next();
    }
  });
const RbiReturn = mongoose.model('rbiReturn', RbiReturnSchema);

export default RbiReturn;



