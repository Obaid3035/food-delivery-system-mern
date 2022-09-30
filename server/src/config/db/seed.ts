import User, {USER_ROLE} from "../../model/user";
import Shop, {DELIVERY_TYPE, SHOP_STATUS} from "../../model/shop";
import faker from "faker";
import mongoose from "mongoose";
import MenuType from "../../model/menuType";
import Category from "../../model/category";
import Product from "../../model/product";
import AddOn from "../../model/addOn";
import Review from "../../model/review";
import Order from "../../model/order";

mongoose.connect("mongodb://localhost/snakrs", (err) => {
    if (!err) {
        console.log("DB CONNECTED")
    } else {
        console.log(err)
    }
})


async function customerSeed() {
    const customerSeed = []
    for (let i = 0; i <= 10; i++) {
        customerSeed.push({
            name: faker.name.findName(),
            email: faker.internet.email().toLowerCase(),
            phoneNumber: faker.phone.phoneNumber(),
            role: USER_ROLE.CUSTOMER,
            password: "12345678",
            address: faker.address.streetAddress(),
            postalCode: faker.address.zipCode(),
        })
    }
    await User.insertMany(customerSeed)
}


async function vendorSeed() {

    for (let i = 0; i <= 10; i++) {
        let vendor = await User.create({
            name: faker.name.findName(),
            email: faker.internet.email().toLowerCase(),
            phoneNumber: faker.phone.phoneNumber(),
            role: USER_ROLE.VENDOR,
            password: "12345678",
        })


        let shop = await Shop.create({
            shopName: faker.company.companyName(),
            address: faker.address.streetAddress(),
            postalCode: faker.address.zipCode(),
            deliveryType: DELIVERY_TYPE.BOTH,
            shopVisibility: true,
            shopStatus: SHOP_STATUS.ACTIVE,
            avgRating: 0,
            noOfReviews: 0,
            shopImage: {
                cloudinary_id: "1234",
                avatar: faker.image.image()
            },
            shopBannerImage: {
                cloudinary_id: "1234",
                avatar: faker.image.image()
            },
            description: faker.lorem.paragraph(9),
            location: {
                coordinates: [parseFloat(faker.address.latitude(51, 50)), parseFloat(faker.address.longitude(7, 5))]
            },
        })



        let addOns = []
        for (let m = 0; m <= 10; m++) {
            let nestedAddOns = []
            for (let j = 0; j <= 5; j++) {
                nestedAddOns.push({
                    name: faker.name.firstName(),
                    price: faker.finance.amount(20, 100)
                })
            }
            addOns.push({
                title: faker.name.firstName(),
                addOn: nestedAddOns,
                shop: shop._id
            })
        }

        const addOn = await AddOn.insertMany(addOns);

        const addOnIds = addOn.map((addOn) => {
            return addOn._id
        })





        for (let a = 0; a <= 15; a++) {
            const menuType = await MenuType.create({
                title: faker.name.firstName(),
                shop: shop._id
            })

            const category = await Category.create({
                title: faker.name.firstName(),
                shop: shop._id
            })
            for (let k = 0; k <= 25; k++) {
                await Product.create({
                    shop: shop._id,
                    addOn: addOnIds,
                    productPrice: faker.finance.amount(20, 100),
                    category: category._id,
                    productName: faker.name.title(),
                    productPicture: {
                        avatar: faker.image.image(),
                        cloudinary_id: "1234"
                    },
                    menuType: menuType._id,
                    allergyInfo: faker.lorem.paragraph(5),
                    cookingTime: new Date(0,0,0,1,0,0)
                })
            }
        }


        const user = await User.find({
            role: USER_ROLE.CUSTOMER
        })

        for (let o = 0; o<=user.length - 1; o++) {
            let orders = [];
            for (let r = 0; r <= 10; r++) {
                let items = [];
                for (let l = 0; l <=12; l++) {
                    let addOn = [];
                    for (let j =0; j<= 12; j++) {
                        addOn.push({
                            name:faker.name.firstName(),
                            price: faker.finance.amount(10, 50),
                        })
                    }
                    items.push({
                        itemName: faker.name.firstName(),
                        itemPrice: faker.finance.amount(10, 500),
                        itemTime: new Date(0,0,0,1,0,0).toString(),
                        quantity:  faker.finance.amount(1, 10),
                        items: addOn
                    })
                }
                orders.push({
                    customer: user[o]._id,
                    shop: shop._id,
                    deliveryType: DELIVERY_TYPE.LOCAL_DELIVERY,
                    totalPrice: faker.finance.amount(10, 500),
                    orderBill: faker.finance.amount(10, 500),
                    serviceCharge: faker.finance.amount(10, 500),
                    notes: faker.lorem.paragraph(5),
                    isReviewed: true,
                    items: items
                })
            }
            await Order.insertMany(orders);
        }

        for (let u = 0; u<=user.length - 1; u++) {
            const reviews = []
            for (let r = 0; r <= 3; r++) {
                reviews.push({
                    shop: shop._id,
                    customer: user[u]._id,
                    comment: faker.lorem.paragraph(7),
                    rating: faker.finance.amount(0, 5),
                })
            }
            await Review.insertMany(reviews);
        }


        vendor.shop = shop._id;
        vendor.profileSetup = true

        await vendor.save()
    }
}

customerSeed().then(() => {
    console.log("CUSTOMER SEEDED")
    vendorSeed().then(() => {
        console.log("VENDOR SEEDED")
        mongoose.disconnect().then(() => {
            console.log("DB DISCONNECTED")
        })
    })
})



