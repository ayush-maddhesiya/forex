import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const TransactionType = {
  WITHDRAW: 'WITHDRAW',
  DEPOSIT: 'DEPOSIT'
};

const TransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED'
};

const PaymentMethod = {
  CARD: 'CARD',
  UPI: 'UPI',
  NETBANKING: 'NETBANKING',
  WALLET: 'WALLET'
};

const TradeType = {
  LONG: 'LONG',
  SHORT: 'SHORT'
};

const TradeStatus = {
  PENDING: 'PENDING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  PENDING_SELL: 'PENDING_SELL'
};

const LoanStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};


const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  aadharNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  pan: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  gender: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  nomineeName: {
    type: String,
    required: true,
    trim: true
  },
  nomineeRelation: {
    type: String,
    required: true,
    trim: true
  },
  nomineeDob: {
    type: Date,
    required: true
  },
  bankName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  accountHolder: {
    type: String,
    required: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['admin', 'user', ],
    default: 'user',
    trim: true
  },
  status: {
    type: String,
    default: 'active',
    trim: true
  },
  loanRequest: [{
    type: Schema.Types.ObjectId,
    ref: 'LoanRequest'
  }],
  paymentInfo: [{
    type: Schema.Types.ObjectId,
    ref: 'PaymentInfo'
  }],
  orderHistory: [{
    type: Schema.Types.ObjectId,
    ref: 'OrderHistory'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});


UserSchema.methods.generateAccessToken = function(){
  return Jwt.sign({
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  }
  )
}

UserSchema.pre('save',async function (next){
  if(!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password,10);
  next();
})



const User = mongoose.model('User', UserSchema);
export default User;
