import { Box, Button, Group, Input, Select, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { City, Country, State } from "country-state-city";
import { useLocation, useNavigate } from "react-router-dom";
import { databases } from "../../../appwriteConfig";

export default function EditContact() {
  const navigate = useNavigate();
  const location = useLocation();
  const dbID = "6409d0710846c3cefc3c";
  const collID = "640afd331648e5db2c79";

  // ------------------------------------------------------------------------

  // ----------------------- for list of city, state & country  ----------------------------
  const [countryList, setCountryList] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [currentCountry, setCurrentCountry] = useState([]);
  const [currentStCode, setCurrentStCode] = useState("");

  // ----------------------- for empty state & city at change ------------------------------
  const [currentStName, setCurrentStName] = useState("");
  const [currentCtName, setCurrentCtName] = useState("");

  // -------------------------------- for input errors -------------------------------------
  const [firstnameerror, setFirstnameerror] = useState("");
  const [lastnameerror, setLastnameerror] = useState("");
  const [mobileErr, setMobileErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [addressErr, setAddressErr] = useState("");

  // -------------------------------------
  const [newContact, setNewContact] = useState({
    user_img: "",
    first_name: "",
    last_name: "",
    mobile_num: "",
    email: "",
    location: "",
  });

  // ---------------------------- get current doc ----------------------------
  const getContactID = location.pathname.split("/");
  const currentContactID = getContactID[getContactID.length - 1];

  useEffect(() => {
    const getData = databases.getDocument(dbID, collID, currentContactID);

    getData
      .then(
        (response) => {
          // console.log(response);
          setNewContact({
            user_id: response.user_id,
            user_img: response.user_img,
            first_name: response.first_name,
            last_name: response.last_name,
            mobile_num: response.mobile_num,
            email: response.email,
            location: "",
          });
        },
        (error) => {
          console.log(error.message);
        }
      )
      .catch((error) => console.log(error));
  }, []);

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

  function handleCountry(e) {
    const filterCountry = countryList.filter((country) => country.value === e);
    setCurrentCountry(filterCountry[0]);
    setCurrentStName("");
    setCurrentCtName("");
    setNewContact({ ...newContact, location: e });
  }

  // ------------------------------- get states of the country -------------------------------

  function handleStates(e) {
    const filterState = states.filter((s) => s.value === e);
    setCurrentStName(filterState[0].value);
    setNewContact({
      ...newContact,
      location: currentStName + ", " + currentCountry,
    });

    setCurrentStCode(filterState[0].statecode);
    setCurrentCtName("");
  }

  function getlistofStates() {
    if (currentCountry.code !== "") {
      const statesOfCountry = State.getStatesOfCountry(currentCountry.code);

      setStates(
        statesOfCountry.map((s) => ({
          label: s.name,
          value: s.name,
          statecode: s.isoCode,
        }))
      );
    } else {
      setStates([]);
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

      setCities(
        citiesofState.map((ct) => ({ label: ct.name, value: ct.name }))
      );
    } else {
      setCities([]);
    }
  }

  useEffect(() => {
    try {
      getlistofCities();
    } catch (error) {
      console.log(error);
    }
  }, [currentStName]);

  function handleCity(e) {
    setCurrentCtName(e);
    setNewContact({
      ...newContact,
      location: e + ", " + currentStName + ", " + currentCountry,
    });
  }

  // ------------------------------- submit details -------------------------------
  useEffect(() => {
    setNewContact({
      ...newContact,
      location:
        currentCtName + ", " + currentStName + ", " + currentCountry.label,
    });
  }, [currentCountry, currentStName, currentCtName]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newContact.first_name === "" || newContact.first_name.length < 2) {
      setFirstnameerror("First Name should be at least 3 character.");
    } else {
      setFirstnameerror("");
    }

    if (newContact.last_name === "" || newContact.last_name.length < 2) {
      setLastnameerror("Last Name should be at least 3 character.");
    } else {
      setLastnameerror("");
    }

    if (newContact.mobile_num === "" || newContact.mobile_num.length < 11) {
      setMobileErr("Mobile number should be at least 10 digit.");
    } else {
      setMobileErr("");
    }

    if (newContact.email === "") {
      setEmailErr("Email should not be empty.");
    } else if (
      /^\b[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b$/.test(
        newContact.email
      ) === false
    ) {
      setEmailErr("Invalid email");
    } else {
      setEmailErr("");
    }

    if (newContact.location === ", , undefined" || newContact.location === "") {
      setAddressErr("Please select location.");
    } else {
      setAddressErr("");
    }

    if (
      newContact.first_name !== "" &&
      newContact.last_name !== "" &&
      newContact.mobile_num !== "" &&
      newContact.email !== "" &&
      newContact.location !== "" &&
      newContact.location !== ", , undefined"
    ) {
      const createCntct = databases.updateDocument(
        dbID,
        collID,
        currentContactID,
        {
          user_id: newContact.user_id,
          user_img: newContact.user_img,
          first_name: newContact.first_name,
          last_name: newContact.last_name,
          mobile_num: newContact.mobile_num,
          email: newContact.email,
          location: newContact.location,
        }
      );

      createCntct
        .then(() => {
          navigate("/users/contact-home");
        })
        .catch((error) => console.log(error));
    } else return;
  };

  return (
    <div className="create-contact-container">
      <Box sx={{ maxWidth: 350 }} mx="auto">
        <div className="Headers">Edit Contact</div>

        <div className="contact-names-input">
          <TextInput
            label="First Name"
            mb="xs"
            withAsterisk
            placeholder="First name"
            title="First Name"
            error={firstnameerror}
            onFocus={() => setFirstnameerror("")}
            value={newContact.first_name}
            onChange={(e) =>
              setNewContact({ ...newContact, first_name: e.target.value })
            }
          />
          <TextInput
            label="Last Name"
            mb="xs"
            withAsterisk
            placeholder="Last name"
            title="Last Name"
            error={lastnameerror}
            onFocus={() => setLastnameerror("")}
            value={newContact.last_name}
            onChange={(e) =>
              setNewContact({ ...newContact, last_name: e.target.value })
            }
          />

          <TextInput
            label="Profile Image"
            mb="xs"
            placeholder="Profile Image"
            title="Profile Image"
            value={newContact.user_img}
            onChange={(e) =>
              setNewContact({ ...newContact, user_img: e.target.value })
            }
          />
        </div>

        <div className="contact-numbers-input">
          <TextInput
            label="Mobile"
            mb="xs"
            withAsterisk
            placeholder="00000 00000"
            component={IMaskInput}
            mask="00000 00000"
            title="Mobile"
            error={mobileErr}
            value={newContact.mobile_num}
            onFocus={() => setMobileErr("")}
            onChange={(e) =>
              setNewContact({ ...newContact, mobile_num: e.target.value })
            }
          />
        </div>

        <TextInput
          label="Email Address"
          mb="xs"
          withAsterisk
          placeholder="your@email.com"
          title="Email"
          error={emailErr}
          value={newContact.email}
          onFocus={() => setEmailErr("")}
          onChange={(e) =>
            setNewContact({ ...newContact, email: e.target.value })
          }
        />

        <div className="contact-address-input">
          <Input.Label required>Location :</Input.Label>
          <Input.Description>Select city, state & country.</Input.Description>
          <Input.Error>{addressErr}</Input.Error>

          <div className="contact-city">
            <Select
              label="Country"
              title="Country"
              searchable
              nothingFound="Not found"
              placeholder="select country"
              onFocus={() => setAddressErr("")}
              dropdownComponent="div"
              onChange={handleCountry}
              data={countryList}
            />

            <Select
              label="State"
              title="State"
              searchable
              nothingFound="Not found"
              placeholder="select state"
              value={currentStName}
              onChange={handleStates}
              data={states}
            />

            <Select
              label="City"
              title="City"
              searchable
              nothingFound="Not found"
              placeholder="select city"
              value={currentCtName}
              dropdownComponent="div"
              onChange={handleCity}
              data={cities}
            />
          </div>
        </div>

        <Group position="center" mt="xs">
          <Button size="xs" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Group>
      </Box>
    </div>
  );
}
