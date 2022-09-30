const regex = {
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phoneNumber: /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?(\d{4}|\d{3}))?$/,
    postalCode: /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/
}

export const authValidation = {
    name: {
        required: {
            value: true,
            message: "Name cannot be empty"
        }
    },


    address: {
        required: {
            value: true,
            message: "Address cannot be empty"
        }
    },
    email: {
        required: {
            value: true,
            message: "Email cannot be empty"
        },
        pattern: {
            value: regex.email,
            message: "Email is not valid"
        }
    },
    phoneNumber: {
        required: {
            value: true,
            message: "Phone number cannot be empty"
        },
        pattern: {
            value: regex.phoneNumber,
            message: "Phone number is not valid"
        }
    },
    password: {
        required: {
            value: true,
            message: "Password cannot be empty"
        },
        minLength: {
            value: 8,
            message: "Password length must be greater than 7"
        }
    }
}

export const categoryValidation = {
    title: {
        required: {
            value: true,
            message: "category cannot be empty"
        }
    }
}

export const menuTypeValidation = {
    title: {
        required: {
            value: true,
            message: "ProductSection type cannot be empty"
        }
    }
}

export const menuValidation = {
    productName: {
        required: {
            value: true,
            message: "Product name cannot be empty"
        }
    },
    productInfo: {
        required: {
            value: true,
            message: "Product information cannot be empty"
        }
    },
    productPrice: {
        required: {
            value: true,
            message: "Product price cannot be empty"
        },
        min: {
            value: 1,
            message: "Product price must be greater than zero"
        }
    },
    allergyInfo: {
        required: {
            value: true,
            message: "Allergy info should not be empty"
        }
    },
    productPicture: {
        required: {
            value: true,
            message: "Product picture is required"
        },
    },
}

export const shopCreateValidation = {
	shopName: {
		required: "Shop Name is required",
	},
    description: {
	  required: "Shop description is required",
    },
	address: {
		required: "Shop address is required",
		pattern: {
			value: /^[\s\S]*$/,
			message: "Invalid Text"
		}
	},
    postalCode: {
	    required: "Postal code is required",
        pattern: {
	        value: regex.postalCode,
            message: "Invalid Postal code"
        }
    },
    shopImage: {
	    required: "Shop Image is required",
    },
    shopBannerImage: {
	    required: "Shop Banner Image is required",
    }

}
