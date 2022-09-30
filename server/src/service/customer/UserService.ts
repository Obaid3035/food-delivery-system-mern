import { Service } from "typedi";
import User from '../../model/user';
import { IResponseMessage, IUser, IUserResponse } from '../../interface';
import NotFound from '../../lib/errorCode';
import { sendForgotPasswordMail } from '../../lib/emailService/email';
import bcrypt from "bcrypt";

@Service()
class UserService  {

  async register(userInput: IUser): Promise<IUserResponse> {
    await User.userExist(userInput.email);
    const user = await User.create(userInput);
    const token: string = await user.generateToken();
    return {
      token,
    };
  }

  async login(userInput: IUser): Promise<IUserResponse> {
    const user = await User.authenticate(userInput);
    const token = await user.generateToken();
    return {
      token,
    };
  }

  async forgotPassword(email: string): Promise<IResponseMessage> {
    const user = await User.findOne({email: email.toLowerCase()});
    if(!user) {
      throw new NotFound('Email not found');
    }
    const emailSent = await sendForgotPasswordMail(user);
    if (!emailSent) {
      throw new Error("An Error has occurred")
    }
    return {
      message: "You have received an email with instructions"
    }
  }


  async resetPassword(userId: string, password: string,): Promise<IResponseMessage> {
    const user = await User.findById(userId);
    user.password = await bcrypt.hash(password, 10)
    await user.save();
    return {
      message: "Your password has been successfully changed"
    }
  }
}

export default UserService;
