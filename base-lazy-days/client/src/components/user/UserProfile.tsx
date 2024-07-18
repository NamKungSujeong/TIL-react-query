import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useMutationState } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "@shared/types";

import { MUTATION_KEY, usePatchUser } from "./hooks/usePatchUser";
import { useUser } from "./hooks/useUser";
import { UserAppointments } from "./UserAppointments";

import { useLoginData } from "@/auth/AuthContext";

export function UserProfile() {
  const { userId } = useLoginData();
  const { user } = useUser();
  const patchUser = usePatchUser();
  const navigate = useNavigate();

  useEffect(() => {
    // use login data for redirect, for base app that doesn't
    //   retrieve user data from the server yet
    if (!userId) {
      navigate("/signin");
    }
  }, [userId, navigate]);

  const pendingData = useMutationState({
    // useMutationState는 여러 변형을 관찰할 수 있으므로 필터가 필요
    // mutateKey의 MUTATION_KEY를 기준으로 필터링
    // 상태가 pending일 때만 이 pending 데이터를 사용
    filters: { mutationKey: [MUTATION_KEY], status: "success" },
    // 조건에 부합하는 모든 변형들의 보류 중인 데이터 배열을 얻을 수 있음
    select: (mutation) => {
      return mutation.state.variables as User;
    },
  });

  // 보류 중인 데이터가 있다면 'pending user'는 보류 중인 데이터 배열의 첫 번째 항목이 될 것이고 그렇지 않으면 null
  const pendingUser = pendingData ? pendingData[0] : null;

  const formElements = ["name", "address", "phone"];
  interface FormValues {
    name: string;
    address: string;
    phone: string;
  }

  return (
    <Flex minH="84vh" textAlign="center" justify="center">
      <Stack spacing={8} mx="auto" w="xl" py={12} px={6}>
        <UserAppointments />
        <Stack textAlign="center">
          <Heading>
            {pendingUser ? pendingUser.name : user?.name} information
          </Heading>
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
          <Formik
            enableReinitialize
            initialValues={{
              name: user?.name ?? "",
              address: user?.address ?? "",
              phone: user?.phone ?? "",
            }}
            onSubmit={(values: FormValues) => {
              patchUser({ ...user, ...values });
            }}
          >
            <Form>
              {formElements.map((element) => (
                <FormControl key={element} id={element}>
                  <FormLabel>{element}</FormLabel>
                  <Field name={element} as={Input} />
                </FormControl>
              ))}
              <Button mt={6} type="submit">
                Update
              </Button>
            </Form>
          </Formik>
        </Box>
      </Stack>
    </Flex>
  );
}
