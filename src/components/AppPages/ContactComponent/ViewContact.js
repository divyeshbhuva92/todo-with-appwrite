import { Avatar, Button, Group, Image, Paper, Text } from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { avatars, databases } from "../../../appwriteConfig";
import CoPresentIcon from '@mui/icons-material/CoPresent';

export default function ContactHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const getContactID = location.pathname.split("/");
  const currentContactID = getContactID[getContactID.length - 1];

  const dbID = "6409d0710846c3cefc3c";
  const collID = "640afd331648e5db2c79";

  const [currentContact, setCurrentContact] = useState([]);

  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    const getContactInfo = databases.getDocument(
      dbID,
      collID,
      currentContactID
    );

    getContactInfo
      .then((res) => {
        setCurrentContact(res);
        setUserAddress(res.location);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  let modifiedLocation = [];
  let newAddress = userAddress.split(", ");
  for (let i = 0; i < newAddress.length; i++) {
    if (newAddress[i] !== "") {
      modifiedLocation.push(newAddress[i]);
    }
  }

  const [qrData, setQRData] = useState("");
  const [vCity, setvCity] = useState("");
  const [vState, setvState] = useState("");
  const [vCountry, setvCountry] = useState("");

  let UserLocation = modifiedLocation.join(", ");
  useEffect(() => {
    setvCity(newAddress[0]);
    setvState(newAddress[1]);
    setvCountry(newAddress[2]);

    setQRData({ ...currentContact, location: UserLocation });
  }, [userAddress]);


  const createQR = avatars.getQR(
    `BEGIN:VCARD
VERSION:3.0
N:${qrData.last_name};${qrData.first_name};;;
FN;PID=1.1:${qrData.first_name} ${qrData.last_name}
EMAIL;type=INTERNET;type=pref;PID=1.1:${qrData.email}
TEL;type=CELL;type=VOICE;type=pref;PID=1.1:${qrData.mobile_num}
CLIENTPIDMAP:1;urn:uuid:${qrData.$id}
ADR;type=home;type=pref:;;;${vCity};${vState};;${vCountry};
END:VCARD
`,
    400,
    2,
    1
  );
  // for referance - const result = avatars.getQR('TEXT, size(1-1000), margin(0-10), download(boolean)');

  return (
    <div className="contact-info-container">
      <div className="contact-info-div">
        <Paper className="contact-info-paper" shadow="lg" radius="md">
          <Avatar
            className="contact-info-img"
            mb="sm"
            color="blue"
            src={currentContact.user_img}
          />

          <div className="contact-info-text">
            <Text className="contact-details">
              <span className="keys">First Name</span>
              <span className="seperator-col">:</span>
              <span className="vals">{currentContact.first_name}</span>
            </Text>
            <Text className="contact-details">
              <span className="keys">Last Name</span>
              <span className="seperator-col">:</span>
              <span className="vals">{currentContact.last_name}</span>
            </Text>
            <Text className="contact-details">
              <span className="keys">Mobile No.</span>
              <span className="seperator-col">:</span>
              <span className="vals">{currentContact.mobile_num}</span>
            </Text>
            <Text className="contact-details">
              <span className="keys">Email</span>
              <span className="seperator-col">:</span>
              <span className="vals">{currentContact.email}</span>
            </Text>
            <Text className="contact-details">
              <span className="keys">Location</span>
              <span className="seperator-col">:</span>
              <span className="vals">{UserLocation}</span>
            </Text>
          </div>

          <div className="QR">
            <Image src={createQR.href} />
          </div>

          <Button
            className="qr-download-btn"
            size="sm"
            component={Link}
            varient="link"
            to={`${createQR.href}`}
          >
            Download QR
          </Button>
        </Paper>

        <Group position="center">
          <Button
            leftIcon={<CoPresentIcon />}
            variant="gradient"
            gradient={{ from: `#087f5b`, to: "blue", deg: 220 }}
            onClick={() => navigate("/users/contact-home")}
          >
            Contact-Book
          </Button>
        </Group>
      </div>
    </div>
  );
}
