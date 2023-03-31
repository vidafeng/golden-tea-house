import React, { useContext, useState } from "react";
import {
  Heading,
  Box,
  Stack,
  StackDivider,
  Text,
  Flex,
  Button,
  useToast,
  CircularProgress,
} from "@chakra-ui/react";
import { CartContext } from "../context/CartContext";
import { useSelector } from "react-redux";
import {
  usePaypalScriptReducer,
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";

const OrderReview = () => {
  // get cart context
  // get checkout details

  const { cart } = useContext(CartContext);
  const state = useSelector((state) => state);
  const toast = useToast();

  // subtotal needs to go first, following variables needs access
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = subtotal > 50 ? 0 : 7.99;
  const tax = subtotal * 0.08875;
  const total = subtotal + tax + shippingPrice;

  const [displayPaypalButton, setDisplayPaypalButton] = useState(false);
  const [{ isPending }, paypalDispatch] = usePaypalScriptReducer;
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState(false);

  const handlePlaceOrder = () => {
    // TODO: save order details to database
    setDisplayPaypalButton(true);
  };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: { total },
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  // use authorizes payment
  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      // TODO: update order status in db
      console.log(details);
      setIsPaid(true);
      toast({
        title: "Payment Successful!",
        description: "Thank you for your order",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    });

    const onError = (error) => {
      setError(true);
      toast({
        title: "Oops, something went wrong!",
        description: { error },
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    };
  };

  return (
    <Stack divier={<StackDivider />} spacing='4'>
      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Shipping Address
        </Heading>

        <Text pt='2' fontSize='sm'>
          {state.shippingAddress.fullName}
        </Text>

        <Text pt='2' fontSize='sm'>
          {state.shippingAddress.address}
        </Text>

        <Text pt='2' fontSize='sm'>
          {state.shippingAddress.city}
        </Text>

        <Text pt='2' fontSize='sm'>
          {state.shippingAddress.postalCode}
        </Text>

        <Text pt='2' fontSize='sm'>
          {state.shippingAddress.country}
        </Text>
      </Box>

      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Payment Method
        </Heading>
        <Text>
          {state.shippingAddress.paymentMethod
            ? state.shippingAddress.paymentMethod
            : "Paypal"}
        </Text>
      </Box>

      <Box>
        <Heading size='xs' textTransform='uppercase'>
          Order Summary
        </Heading>
        <Text pt='2' fontSize='sm'>
          Items: ${subtotal}
        </Text>
        <Text pt='2' fontSize='sm'>
          Shipping: ${shippingPrice}
        </Text>
        <Text pt='2' fontSize='sm'>
          Tax: ${tax}
        </Text>
        <Text pt='2' fontSize='sm'>
          Total: ${total}
        </Text>

        <Flex justify='center' align='center' pt='4'>
          {displayPaypalButton ? (
            <PayPalButtons
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
            />
          ) : (
            <Button onClick={handlePlaceOrder} colorScheme='yellow' size='sm'>
              Place Order
            </Button>
          )}
        </Flex>
      </Box>
    </Stack>
  );
};

export default OrderReview;
