import React, {useState} from 'react';
import {Modal} from "react-bootstrap";
import {IAddOn} from "../../../../../../vendor/Pages/AddOn/CreateAddOn/CreateAddOn";
import {AiFillCloseCircle} from "react-icons/ai";
import './AddOnModal.css'
import {IProduct} from "../../../../../../vendor/Pages/Product/Product";
import {getDecryptedCartItems, storeEncryptedCartItems} from "../../../../../../../lib/helper";
import {ICart} from "../Product";

interface IAddOnModal {
    addOnShow: boolean;
    onAddOnModalChange: () => void,
    product: IProduct,
    onCartChangeHandler: (cart:any) => void,
    deliveryType: string
}

const AddOnModal: React.FC<IAddOnModal> = ({ addOnShow, onAddOnModalChange, product, onCartChangeHandler, deliveryType}) => {
    const [checkedRadio, setCheckedRadio] = useState<any>({})
    const onAddOnClickHandler = (e: React.ChangeEvent<HTMLInputElement>, title: string, addOnItem: IAddOn) => {
        const check = e.target.checked;
        const addOnId = e.target.value;
        if (check) {
            setCheckedRadio({
                ...checkedRadio,
                [title]: {
                    [addOnId]: check,
                    _id: addOnItem._id,
                    name: addOnItem.name,
                    price: addOnItem.price,
                    title,
                }
            })
        } else {
            const checkedRadioClone = {
                ...checkedRadio
            };
            delete checkedRadioClone[title]
            setCheckedRadio(checkedRadioClone)
        }
    }

    const onSubmitHandler = () => {
        const addOn: any = [];

        if (Object.keys(checkedRadio).length !== 0) {
            for (const item in checkedRadio ) {
                addOn.push({
                    ...checkedRadio[item]
                })
            }
            const cart: any = {
                _id: product._id,
                cookingTime: product.cookingTime,
                productName: product.productName,
                productPrice: product.productPrice,
                qty: 1,
                addOn
            };
            const cartItem: ICart = getDecryptedCartItems()
            cartItem.deliveryType = deliveryType;
            cartItem.cart.push(cart)
            onCartChangeHandler(cartItem)
            storeEncryptedCartItems(cartItem)
        } else {
            const cartItem: ICart = getDecryptedCartItems()
            cartItem.deliveryType = deliveryType;
            cartItem.cart.push({
                _id: product._id,
                cookingTime: product.cookingTime,
                productName: product.productName,
                productPrice: product.productPrice,
                qty: 1,
                addOn: []
            })
            onCartChangeHandler(cartItem)
            storeEncryptedCartItems(cartItem)
        }
        onAddOnModalChange()
    }

    return (
        <Modal show={addOnShow}>
            <Modal.Header className="d-flex justify-content-between align-items-center review_header">
                <h5 className={"m-0"}> Add On </h5>
                <AiFillCloseCircle onClick={onAddOnModalChange} className={"m-0 close_modal"}/>
            </Modal.Header>
            <Modal.Body>
                <div className='addOn_modal'>
                    <ul>
                        {
                            product.addOn.map((addOn) => (
                                <li key={addOn._id}>
                                    <h5> {addOn.title} </h5>
                                    {
                                        addOn.addOn.map((value) => {
                                            return (
                                                <div key={value._id} className={'w-100'}>
                                                    <input className="form-check-input"
                                                           type="checkbox"
                                                           value={value._id}
                                                           checked={checkedRadio[addOn.title] && checkedRadio[addOn.title][value._id!] ? true : false}
                                                           onChange={(e) => onAddOnClickHandler(e, addOn.title, value)}
                                                    />
                                                    <label className="form-check-label add_on_label">
                                                        <p className={'d-flex align-items-center justify-content-between'}>
                                                            <span>{value.name}</span>
                                                            <span className='ml-3 text-muted'> £ {value.price}</span>
                                                        </p>
                                                    </label>
                                                </div>
                                            )
                                        })
                                    }
                                    <hr/>
                                </li>
                            ))
                        }
                    </ul>
                    <button className={'w-100 btn-send'} onClick={onSubmitHandler}>ADD TO CART</button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AddOnModal;
