import React from "react";
import ShippingAddressForm from "../components/forms/Shipping";
import { useSelector, useDispatch } from "react-redux";
import {
  Progress,
  Card,
  CardHeader,
  CardFooter,
  Heading,
  Stack,
  Box,
  CardBody,
} from "@chakra-ui/react";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const activeStep = useSelector((state) => state.currentStep);
  console.log(activeStep);

  const steps = [
    { name: "Shipping", component: <ShippingAddressForm /> },
    { name: "Payment", component: <div>Payment</div> },
    { name: "Review", component: <div>Review</div> },
  ];

  return (
    <Stack spacing={4}>
      <Progress value={activeStep} max={steps.length} />
      <Box mx="auto">
        <Card w="xl" m="auto">
          <CardHeader>{steps[activeStep].name}</CardHeader>
          <CardBody>{steps[activeStep].component}</CardBody>
        </Card>
      </Box>
    </Stack>
  );
};

export default CheckoutPage;
