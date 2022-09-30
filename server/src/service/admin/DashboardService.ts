import {Service} from "typedi";
import Shop, {SHOP_STATUS} from "../../model/shop";

@Service()
class DashboardService {
    async index() {
        const latestVendorsPromise = Shop.find().select("shopName address shopStatus").sort({createdAt: -1}).limit(10)
        const latestVendorsCountPromise = Shop.find().sort({createdAt: -1}).limit(5).count()
        const activeVendorCountPromise = Shop.find({
            shopStatus: SHOP_STATUS.ACTIVE
        }).count()
        const inActiveVendorCountPromise = Shop.find({
            shopStatus: SHOP_STATUS.INACTIVE
        }).count()

        const [vendors, vendorsCount, activeVendorCount, inActiveVendorCount] =
            await Promise.all([latestVendorsPromise, latestVendorsCountPromise,
                activeVendorCountPromise, inActiveVendorCountPromise])

        const formattedVendors = vendors.map((vendor: any) => {
            let obj = {
                _id: vendor._id,
                shopName: vendor.shopName,
                address: vendor.address,
                status: vendor.shopStatus,
            }
            return Object.values(obj)
        })
        return {
            formattedVendors,
            vendorsCount,
            activeVendorCount,
            inActiveVendorCount
        }
    }
}

export default DashboardService;
