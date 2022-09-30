import {Service} from "typedi";
import User, {USER_ROLE} from "../../model/user";
import {IUser} from "../../interface";

@Service()
class CustomerService {
    async index(skip: number, limit: number) {
        const customerPromise = User.find({
            role: USER_ROLE.CUSTOMER,
        }).select('name email phoneNumber').skip(skip).limit(limit);

        const customerCountPromise = User.find({
            role: USER_ROLE.CUSTOMER,
        }).count()

        const [customer, customerCount] = await Promise.all([customerPromise, customerCountPromise]);

        const formattedCustomer = customer.map((user: IUser) => {
            let obj = {
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
            return Object.values(obj)
        })

        return {
            formattedCustomer,
            customerCount
        }
    }
}

export default CustomerService;
