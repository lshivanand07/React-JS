/* eslint-disable @typescript-eslint/no-explicit-any */
import withErrorHandling from '../../hoc/withErrorHandling';
import withLoader from '../../hoc/withLoader';
import './SellNewProduct.css';
import { useState } from 'react';
import Button from '../../components/Buttons/Button';
import { createProduct } from '../../services/ProductApi';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

interface SellProductProps {
  message: string;
  productData: any;
  setProductData: (value: any) => void;
  newProductData: ({ value }: any) => void;
  showPopup: boolean;
  setShowPopup: (value: boolean) => void;
}

const SellProduct = ({
  message,
  productData,
  setProductData,
  newProductData,
  showPopup,
  setShowPopup,
}: SellProductProps) => {
  const handleProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProductData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProductData((prev: any) => ({
      ...prev,
      discount: {
        ...prev.discount,
        [name]: value,
      },
    }));
  };

  const handleVariantChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;

    setProductData((prev: any) => ({
      ...prev,
      variants: prev.variants.map((variant: any, i: number) =>
        i === index
          ? {
              ...variant,
              [name]:
                name === 'price' || name === 'stock' ? Number(value) : value,
            }
          : variant
      ),
    }));
  };

  const [count, setCount] = useState(1);

  return (
    <div className="container">
      <div className="add-product-container">
        <Breadcrumbs />
        <h2 className="product-heading">Sell New Product</h2>

        <h3>Product</h3>
        <form className="product">
          <div className="product-input-div">
            <label htmlFor="product-name">Product Name</label>
            <input
              id="product-name"
              type="text"
              placeholder="Product Name"
              name="product_name"
              value={productData.product_name}
              onChange={handleProductChange}
            />
          </div>
          <div className="product-input-div">
            <label htmlFor="image-url">Image URL</label>
            <input
              id="image-url"
              type="text"
              placeholder="Image URL"
              name="image_url"
              value={productData.image_url}
              onChange={handleProductChange}
            />
          </div>
          <div className="product-input-div">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Description"
              name="description"
              rows={1}
              value={productData.description}
              onChange={handleProductChange}
            ></textarea>
          </div>
        </form>

        <h3>Discount</h3>

        <form className="discount">
          <div className="product-input-div">
            <label htmlFor="discount-percentage">Discount</label>
            <input
              id="discount-percentage"
              type="number"
              placeholder="Discount %"
              name="discount_percentage"
              value={productData.discount_percentage}
              onChange={handleDiscountChange}
              min={1}
            />
          </div>
          <div className="product-input-div">
            <label htmlFor="start-date">Start Date</label>
            <input
              id="start-date"
              type="date"
              placeholder="Start Date"
              name="start_date"
              value={productData.start_date}
              onChange={handleDiscountChange}
            />
          </div>
          <div className="product-input-div">
            <label htmlFor="end-date">End Date</label>
            <input
              id="end-date"
              type="date"
              placeholder="End Date"
              name="end_date"
              value={productData.end_date}
              onChange={handleDiscountChange}
            />
          </div>
        </form>

        <h3>Variants</h3>

        {Array.from({ length: count }).map((_, index: number) => (
          <>
            <p>varient {index + 1}</p>
            <form className="product-variants">
              <div className="product-input-div">
                <label htmlFor="size">Size</label>
                <input
                  id="size"
                  type="text"
                  placeholder="enter size of produt"
                  name="size"
                  value={productData.size}
                  onChange={(e) => handleVariantChange(e, index)}
                />
              </div>
              <div className="product-input-div">
                <label htmlFor="color">Color</label>
                <input
                  id="color"
                  type="text"
                  placeholder="enter color of produt"
                  name="color"
                  value={productData.color}
                  onChange={(e) => handleVariantChange(e, index)}
                />
              </div>
              <div className="product-input-div">
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  type="number"
                  placeholder="set price for product"
                  name="price"
                  value={productData.price}
                  onChange={(e) => handleVariantChange(e, index)}
                  min={1}
                />
              </div>
              <div className="product-input-div">
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  type="number"
                  placeholder="set product stock"
                  name="stock"
                  value={productData.stock}
                  onChange={(e) => handleVariantChange(e, index)}
                  min={1}
                />
              </div>
            </form>
          </>
        ))}
        <div className="button-group">
          <button
            onClick={() => {
              setCount(count + 1);
              setProductData((prev: any) => ({
                ...prev,
                variants: [
                  ...prev.variants,
                  {
                    size: '',
                    color: '',
                    price: 0,
                    stock: 0,
                  },
                ],
              }));
            }}
          >
            Add More Variant
          </button>

          <button onClick={() => setCount(count - 1)}>delete</button>
          <button className="submit-btn" onClick={() => setShowPopup(true)}>
            Create Product
          </button>
        </div>

        {showPopup && (
          <div className="model-overlay">
            <div className="modal-container">
              {message && (
                <>
                  <h4>{message}</h4>
                  <Button
                    text="Ok"
                    onClick={() => setShowPopup(false)}
                  ></Button>
                </>
              )}
              {!message && (
                <>
                  <h4>are you sure you want to add New Product</h4>
                  <div className="userConformationBtn">
                    <Button
                      text="Ok"
                      onClick={() => newProductData(productData)}
                    ></Button>
                    <Button
                      text="Cancel"
                      onClick={() => setShowPopup(false)}
                    ></Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EnhancedSellProduct = withLoader(withErrorHandling(SellProduct));

function SellProductContainer() {
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<any>();
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [productData, setProductData] = useState({
    product_name: '',
    description: '',
    discount: {
      discount_percentage: 0,
      start_date: '',
      end_date: '',
    },
    image_url: '',
    variants: [
      {
        size: '',
        color: '',
        price: 0,
        stock: 0,
      },
    ],
  });
  console.log('productData', productData);

  async function newProductData(productData: any) {
    try {
      setLoading(true);
      console.log('productData', productData);
      const data = await createProduct(productData);
      setMessage(data.message);
      setShowPopup(true);
    } catch (error) {
      setServerError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <EnhancedSellProduct
      loading={loading}
      serverError={serverError}
      message={message}
      setProductData={setProductData}
      productData={productData}
      newProductData={newProductData}
      showPopup={showPopup}
      setShowPopup={setShowPopup}
    />
  );
}

export default SellProductContainer;
