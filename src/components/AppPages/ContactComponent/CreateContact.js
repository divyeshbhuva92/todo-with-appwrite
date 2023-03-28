import { Box, Button, Group, Input, Select, TextInput } from "@mantine/core";
import { account, databases } from "../../../appwriteConfig";
import { City, Country, State } from "country-state-city";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import * as yup from "yup";
import { IMaskInput } from "react-imask";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateContact() {
  const navigate = useNavigate();

  const dbID = "6409d0710846c3cefc3c";
  const collID = "640afd331648e5db2c79";

  const [userID, setUserID] = useState("");

  // ----------------------- list of city, state & country  ----------------------------
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  // ------------------------------- list of countries -------------------------------
  const countries = Country.getAllCountries();

  useEffect(() => {
    setCountryList(
      countries.map((item) => ({
        label: item.name,
        value: item.name,
        code: item.isoCode,
      }))
    );
  }, []);

  // --------------------------------------- set country -------------------------------------
  const [currentCountry, setCurrentCountry] = useState([]);
  const [currentStCode, setCurrentStCode] = useState("");

  function handleCountry(cnt) {
    formik.setFieldValue("states", null);
    formik.setFieldValue("city", null);

    const filterCountry = countryList.filter(
      (country) => country.value === cnt
    );
    setCurrentCountry(filterCountry[0]);
    formik.setFieldValue("country", cnt);
  }

  // ------------------------------- get states of the country -------------------------------

  function handleStates(stt) {
    formik.setFieldValue("city", null);

    const filterState = stateList.filter((s) => s.value === stt);
    setCurrentStCode(filterState[0].statecode);
    formik.setFieldValue("states", stt);
  }

  function getlistofStates() {
    if (currentCountry.code !== "") {
      const statesOfCountry = State.getStatesOfCountry(currentCountry.code);

      setStateList(
        statesOfCountry.map((s) => ({
          label: s.name,
          value: s.name,
          statecode: s.isoCode,
        }))
      );
    } else {
      setStateList([]);
    }
  }

  useEffect(() => {
    setCurrentStCode("");

    try {
      getlistofStates();
    } catch (error) {
      console.log(error);
    }
  }, [currentCountry]);

  // ------------------------------- get cities of the state -------------------------------

  function getlistofCities() {
    if (currentStCode !== "") {
      const citiesofState = City.getCitiesOfState(
        currentCountry.code,
        currentStCode
      );

      setCityList(
        citiesofState.map((ct) => ({ label: ct.name, value: ct.name }))
      );
    } else {
      setCityList([]);
    }
  }

  useEffect(() => {
    try {
      getlistofCities();
    } catch (error) {
      console.log(error);
    }
  }, [currentStCode]);

  // ------------------------------ get contacts collection & filter it userwise -----------------------------------
  const [contacts, setContacts] = useState([]);
  const [currUserCntList, setCurrUserCntList] = useState([]);

  useEffect(() => {
    const getContacts = databases.listDocuments(dbID, collID);

    getContacts
      .then((res) => {
        setContacts(res.documents);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const currCntList = contacts.filter((doc) => doc.user_id === userID);
    setCurrUserCntList(currCntList);
  }, [contacts]);

  // ------------------------------- submit details -------------------------------

  useEffect(() => {
    const getUser = account.get();
    getUser.then(
      (response) => {
        setUserID(response.$id);
      },
      (error) => {
        console.log(error.message);
      }
    );
  }, []);

  const contactValidSchema = yup.object({
    first_name: yup
      .string("Enter first name")
      .min(3, "First name should be of minimum 3 characters length")
      .required("First name is required"),
    last_name: yup
      .string("Enter last name")
      .min(3, "Last name should be of minimum 3 characters length")
      .required("Last name is required"),
    mobile_num: yup
      .string("Enter mobile number")
      .min(11, "Mobile number should be of minimum 10 characters length")
      .required("Mobile number is required"),
    email: yup
      .string("Enter your email")
      .test("validEmail", "Enter valid email", (val) =>
        /^\b[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b$/.test(val)
      )
      .required("Email is required"),
    country: yup
      .string("Enter last name")
      .min(3, "Last name should be of minimum 3 characters length")
      .required("Country is required"),
  });

  const formik = useFormik({
    initialValues: {
      user_id: "",
      user_img: "",
      first_name: "",
      last_name: "",
      mobile_num: "",
      email: "",
      country: "",
      states: "",
      city: "",
    },
    validationSchema: contactValidSchema,
    onSubmit: (val) => {
      const createCntct = databases.createDocument(dbID, collID, uuidv4(), {
        ...val,
        user_id: userID,
      });

      createCntct
        .then(() => {
          navigate("/users/contact-home");
        })
        .catch((error) => console.log(error));
    },
  });

  return (
    <div className="create-contact-container">
      <Box sx={{ maxWidth: 350 }} mx="auto">
        <div className="Headers">Create New Contact</div>

        <form onSubmit={formik.handleSubmit}>
          <TextInput
            label="First Name"
            withAsterisk
            mb="xs"
            placeholder="First name"
            name="first_name"
            error={
              formik.touched.first_name && formik.errors.first_name
                ? formik.errors.first_name
                : null
            }
            onChange={formik.handleChange}
            value={formik.values.first_name}
          />

          <TextInput
            label="Last Name"
            withAsterisk
            mb="xs"
            placeholder="Last name"
            name="last_name"
            error={
              formik.touched.last_name && formik.errors.last_name
                ? formik.errors.last_name
                : null
            }
            onChange={formik.handleChange}
            value={formik.values.last_name}
          />

          <TextInput
            label="Mobile"
            withAsterisk
            mb="xs"
            name="mobile_num"
            placeholder="00000 00000"
            component={IMaskInput}
            mask="00000 00000"
            error={
              formik.touched.mobile_num && formik.errors.mobile_num
                ? formik.errors.mobile_num
                : null
            }
            onChange={formik.handleChange}
            value={formik.values.mobile_num}
          />

          <TextInput
            label="Email"
            withAsterisk
            mb="xs"
            placeholder="your@email.com"
            name="email"
            error={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : null
            }
            onChange={formik.handleChange}
            value={formik.values.email}
          />

          <TextInput
            label="Profile Image"
            mb="xs"
            placeholder="Profile Image"
            name="user_img"
            onChange={formik.handleChange}
            value={formik.values.user_img}
          />

          <div className="contact-address-input">
            <Input.Label>Location :</Input.Label>
            <Input.Description>Select city, state & country.</Input.Description>

            <Select
              placeholder="Select country"
              label="Country"
              withAsterisk
              mb="xs"
              dropdownComponent="div"
              error={
                formik.touched.country && formik.errors.country
                  ? formik.errors.country
                  : null
              }
              data={countryList}
              onChange={handleCountry}
              value={formik.values.country}
            />

            <Select
              placeholder="Select state"
              label="State"
              mb="xs"
              dropdownComponent="div"
              data={stateList}
              onChange={handleStates}
              value={formik.values.states}
            />

            <Select
              placeholder="Select city"
              label="City"
              mb="xs"
              dropdownComponent="div"
              data={cityList}
              onChange={(e) => formik.setFieldValue("city", e)}
              value={formik.values.city}
            />
          </div>

          <Group position="center" mt="xs">
            <Button size="xs" type="submit">
              Submit
            </Button>
          </Group>
        </form>
      </Box>
    </div>
  );
}
