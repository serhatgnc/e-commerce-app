import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Skeleton,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import Breadcrumb from "components/Breadcrumb";
import CustomModal from "components/Modal";
import { useUserToken } from "context/userContext";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { Product } from "service/axios";
import { capitalize } from "utils/capitalize";
import { Toaster } from "utils/Toster";
import ContactSellerForm from "./ContactSeller/ContactSellerForm";

type StateTypes = {
    productDetails: Global.Products.Product | undefined;
    isContactSellerFormOpen: boolean;
    isFetchingData: boolean;
};

const ProductDetails: FC = () => {
    const [
        { isContactSellerFormOpen, isFetchingData, productDetails },
        setState,
    ] = useState<StateTypes>({
        productDetails: undefined,
        isContactSellerFormOpen: false,
        isFetchingData: false,
    });

    const userToken = useUserToken();
    const userHasToken = !!userToken?.userToken?._id;

    const router = useRouter();
    const { _id } = router.query;

    const getProduct = async () => {
        setState((state) => ({ ...state, isFetchingData: true }));
        try {
            const response = await Product.GET(_id as string);
            setState((state) => ({
                ...state,
                isFetchingData: false,
                productDetails: response,
            }));
        } catch (error: any) {
            setState((state) => ({ ...state, isFetchingData: false }));
            Toaster("", `${error?.response?.data}`, "error");
        }
    };

    useEffect(() => {
        getProduct();
    }, []);

    const toggleContactSellerFormModal = (requireRefect: boolean = false) => {
        setState((state) => ({
            ...state,
            isContactSellerFormOpen: !isContactSellerFormOpen,
        }));
        requireRefect && getProduct();
    };

    const isUsersOwnProduct =
        userToken?.userToken?._id === productDetails?.user;

    return (
        <>
            {isFetchingData ? (
                <Skeleton maxW="1200px" w="100%" h="83vh" />
            ) : productDetails ? (
                <Flex
                    userSelect="none"
                    h="100%"
                    flexDir="column"
                    maxW="1200px"
                    w="100%"
                    fontSize="1.1rem"
                    px={["3rem", "3rem", "3rem", "3rem", "unset"]}
                    opacity={productDetails.isItSold ? 0.6 : 1}
                >
                    <Head>
                        <title>{`${productDetails.title} | ${productDetails.category}`}</title>
                        <meta
                            property="og:title"
                            content="Product"
                            key="product"
                        />
                    </Head>
                    <Breadcrumb
                        parentText={productDetails.category}
                        childText={productDetails.title}
                    />

                    <Heading alignSelf="center" fontFamily="Nunito">
                        {capitalize(productDetails.title)}
                    </Heading>
                    <Flex
                        mt="1rem"
                        w="100%"
                        flexDir={[
                            "column",
                            "column",
                            "column",
                            "column",
                            "row",
                        ]}
                    >
                        <Box
                            w={["100%", "100%", "100%", "100%", "70%"]}
                            h="500px"
                            rounded="6px"
                            overflow="hidden"
                            position="relative"
                        >
                            <Image src={productDetails?.image} layout="fill" />
                        </Box>
                        <Flex
                            pl={["unset", "unset", "unset", "unset", "2rem"]}
                            flexDir="column"
                            w={["100%", "100%", "100%", "100%", "30%"]}
                            rounded="6px"
                            textAlign="start"
                            my={["2rem", "2rem", "2rem", "2rem", "unset"]}
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Center flexDir="column">
                                <Avatar
                                    size="xl"
                                    name={productDetails.userNameAndSurname}
                                    cursor="pointer"
                                    onClick={() =>
                                        router.push(
                                            `/profile/${productDetails.user}`
                                        )
                                    }
                                />
                                <Flex mt="1rem">
                                    <Text mr="1rem" fontWeight="bold">
                                        Seller:
                                    </Text>
                                    <Text>
                                        {productDetails.userNameAndSurname}
                                    </Text>
                                </Flex>
                            </Center>
                            <Center flexDir="column">
                                <Flex>
                                    <Text mr="0.5rem" fontWeight="bold">
                                        Category:
                                    </Text>
                                    <Text>{productDetails.category}</Text>
                                </Flex>
                                <Flex>
                                    <Text mr="0.5rem" fontWeight="bold">
                                        Price:
                                    </Text>
                                    <Text>
                                        {new Intl.NumberFormat("tr-TR", {
                                            style: "currency",
                                            currency: "TRY",
                                            maximumSignificantDigits: 4,
                                        }).format(Number(productDetails.price))}
                                    </Text>
                                </Flex>
                            </Center>
                            {!isUsersOwnProduct && (
                                <Tooltip
                                    visibility={
                                        !userHasToken || productDetails.isItSold
                                            ? "visible"
                                            : "hidden"
                                    }
                                    label={
                                        !userHasToken
                                            ? "Please login to make a purchase request."
                                            : productDetails.isItSold
                                            ? "This item has already been sold."
                                            : ""
                                    }
                                >
                                    <Center w="100%">
                                        <Button
                                            mt="1rem"
                                            w={[
                                                "50%",
                                                "50%",
                                                "50%",
                                                "50%",
                                                "100%",
                                            ]}
                                            onClick={() =>
                                                toggleContactSellerFormModal(
                                                    false
                                                )
                                            }
                                            disabled={
                                                !userHasToken ||
                                                productDetails.isItSold
                                            }
                                        >
                                            Contact the seller
                                        </Button>
                                    </Center>
                                </Tooltip>
                            )}
                        </Flex>
                    </Flex>
                    <Flex mt="2rem" flexDir="column">
                        <Text mr="0.5rem" fontWeight="bold">
                            Description
                        </Text>
                        <Text>{productDetails.description}</Text>
                    </Flex>
                    {isContactSellerFormOpen && (
                        <CustomModal
                            content={
                                <ContactSellerForm
                                    closeModal={toggleContactSellerFormModal}
                                    productInfo={productDetails}
                                />
                            }
                            header="Contact the Seller"
                            onClickClose={toggleContactSellerFormModal}
                        />
                    )}
                </Flex>
            ) : (
                <Center>No Product Detail</Center>
            )}
        </>
    );
};

export default ProductDetails;
