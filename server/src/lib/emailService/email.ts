import sgMail from '@sendgrid/mail';
import jwt from "jsonwebtoken";
import { emailPromise } from './emailPromise';
import { IUser } from '../../interface';


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendForgotPasswordMail = async (user: IUser) => {
	try {
		const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '20m'});
		const html = `<h3>Please click on the link below to recover your password</h3><br/>
			<a href="https://snakrs-client.herokuapp.com/resetPassword/${token}">Click Here</a>`
		const subject = "Recover Password"
		await emailPromise({ token, email: user.email, html, subject })
		return true
	} catch (e) {
		return false
	}
};

export const sendOrderCreatedMail = async (user: IUser) => {
  try {
	  const html = `<h3>Your order has been created</h3><br/>`
	  const subject = "Order Created"
	  await emailPromise({ email: user.email, html, subject })
	  return true
  } catch (e) {
	  return false
  }
}

export const vendorOrderConfirmation = async (vendorEmail: string, customerEmail: string) => {
	try {
		const html = `<h3>An order has been created by ${customerEmail}</h3><br/>`
		const subject = "Order Created"
		await emailPromise({ email: vendorEmail, html, subject })
		return true
	} catch (e) {
		return false
	}
}

export const sendOrderApprovedMail = async (customerEmail: string) => {
	try {
		const html = `<h3>Your order has been approved</h3><br/>`
		const subject = "Order Approved"
		await emailPromise({ email: customerEmail, html, subject })
		return true
	} catch (e) {
		return false
	}
}

export const sendOrderReadyMail = async (customerEmail: string) => {
	try {
		const html = `<h3>Your order has been ready</h3><br/>`
		const subject = "Order Ready"
		await emailPromise({ email: customerEmail, html, subject })
		return true
	} catch (e) {
		return false
	}
}

export const sendOrderRejectedMail = async (customerEmail: string) => {
	try {
		const html = `<h3>Your order has been rejected</h3><br/>`
		const subject = "Order Rejected"
		await emailPromise({ email: customerEmail, html, subject })
		return true
	} catch (e) {
		return false;
	}
}

export const shopActiveConfirmation = async (vendorEmail: string) => {
	try {
		const html = `<h3>Thank you for joining Snakrs</h3><br/>`
		const subject = 'Congratulations Your Shop has been active'
		await emailPromise({ email: vendorEmail, html, subject })
		return true
	} catch (e) {
		return false;
	}
}
