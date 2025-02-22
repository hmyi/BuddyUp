import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EventCreation({ accessToken }) {
  // flow control state
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);

  // event data state
  const [eventName, setEventName] = React.useState("");
  const [city, setCity] = React.useState("Waterloo");
  const [category, setCategory] = React.useState("Social");
  const [location, setLocation] = React.useState("");
  const [startTime, setStartTime] = React.useState(dayjs("2025-05-12T14:30"));
  const [endTime, setEndTime] = React.useState(dayjs("2025-05-12T15:30"));
  const [capacity, setCapacity] = React.useState(1);
  const [eventDescription, setEventDescription] = React.useState(
    eventDescriptionFiller
  );
  const [file, setFile] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    handleCleanUp();
    setStep(0);
    setOpen(false);
  };

  function handleNext() {
    if (step < 2) {
      setStep((s) => s + 1);
    } else {
      handleClose();
    }
  }

  function handlePrevious() {
    if (step > 0) {
      setStep((s) => s - 1);
    }
  }

  function handleCleanUp() {
    setEventName("");
    setCity("Waterloo");
    setCategory("Social");
    setLocation("");
    setStartTime(dayjs("2025-05-12T14:30"));
    setEndTime(dayjs("2025-05-12T15:30"));
    setCapacity(1);
    setEventDescription(eventDescriptionFiller);
    setFile(null);
  }

  function handleSubmit(e) {
    dayjs.extend(utc); // Extend dayjs with UTC support
    const utcStartTime = dayjs(startTime).utc().format();
    const utcEndTime = dayjs(endTime).utc().format();

    const event = {
      title: eventName,
      category: category,
      city: city,
      location: location,
      start_time: utcStartTime,
      end_time: utcEndTime,
      description: eventDescription,
      capacity: capacity,
    };

    if (!accessToken) {
      console.error("No access token received!");
      return;
    }

    console.log("EventCreation with acessToekn: ", accessToken);
    console.log("🚀 Making API Request...");

    fetch("https://3.128.172.39:8000/api/events/new/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Add Bearer Token
      },
      body: JSON.stringify(event),
    })
      .then((res) => {
        console.log("API Fetch Called, Status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("API Response Data:", data);
      })
      .catch((error) => console.error("Error:", error));

    handleCleanUp();
    handleClose();
  }

  return (
    <React.Fragment>
      <Button
        style={{
          backgroundColor: "#00798a",
          color: "white",
          borderRadius: "4px",
          margin: "10px",
        }}
        variant="outlined"
        type="button"
        onClick={handleClickOpen}
      >
        Create New Event
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              BuddyUp
            </Typography>
            <Button
              autoFocus
              color="inherit"
              type="button"
              onClick={handleClose}
            >
              Exit
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ mt: 10 }}>
          <HorizontalLinearAlternativeLabelStepper step={step} />
        </Box>
        <form onSubmit={handleSubmit}>
          <Box>
            {step === 0 ? (
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  marginTop: "10rem",
                }}
              >
                <TextField
                  sx={{ width: "20rem", margin: "auto" }}
                  label="Event Name"
                  color="primary"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  helperText="200 char max"
                />
                <CitySelect city={city} setCity={setCity} />
                <CategorySelect category={category} setCategory={setCategory} />
              </Stack>
            ) : (
              ""
            )}
            {step === 1 ? (
              <Stack
                direction="column"
                spacing={10}
                sx={{
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  marginTop: "5rem",
                }}
              >
                <TextField
                  sx={{ width: "50rem", margin: "auto" }}
                  label="Location"
                  color="primary"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  helperText="255 char max"
                />

                <StartEndDateTimePicker
                  startTime={startTime}
                  setStartTime={setStartTime}
                  endTime={endTime}
                  setEndTime={setEndTime}
                />
                <CapacitySlider capacity={capacity} setCapacity={setCapacity} />
              </Stack>
            ) : (
              ""
            )}

            {step === 2 ? (
              <Stack
                direction="column"
                spacing={10}
                sx={{
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  marginTop: "5rem",
                }}
              >
                <Box>
                  <h1>Describe your event</h1>
                  <TextField
                    sx={{ width: "50rem", margin: "auto" }}
                    label="Event Description"
                    multiline
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
                </Box>
                <FileUpload file={file} setFile={setFile} />
              </Stack>
            ) : (
              ""
            )}
          </Box>
          <Stack
            direction="row"
            spacing={10}
            sx={{
              justifyContent: "space-evenly",
              alignItems: "center",
              marginTop: "5rem",
            }}
          >
            <Button
              type="button"
              variant="contained"
              disabled={step === 0}
              onClick={handlePrevious}
            >
              Previous
            </Button>
            {step < 2 ? (
              <Button type="button" variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              ""
            )}
            {step === 2 ? (
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleSubmit}
              >
                Create
              </Button>
            ) : (
              ""
            )}
          </Stack>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

function HorizontalLinearAlternativeLabelStepper({ step }) {
  const steps = [
    "Basic Information",
    "Event Details",
    "Additional Information",
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={step} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

function CapacitySlider({ capacity, setCapacity }) {
  const marks = [
    {
      value: 10,
      label: "small event",
    },
    {
      value: 50,
      label: "regular event",
    },
    {
      value: 100,
      label: "big event",
    },
  ];

  return (
    <Box
      sx={{
        width: 500,
        margin: "auto",
      }}
    >
      <Typography gutterBottom>Capacity</Typography>
      <Slider
        aria-label="Default"
        valueLabelDisplay="auto"
        marks={marks}
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value))}
      />
    </Box>
  );
}

function CitySelect({ city, setCity }) {
  const citys = ["Waterloo", "kitchener", "Tonronto"];

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <FormControl required>
      <InputLabel>City</InputLabel>
      <Select value={city} onChange={handleChange}>
        {citys.map((city) => (
          <MenuItem key={city} value={city}>
            {city}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function CategorySelect({ category, setCategory }) {
  const categories = [
    "Social",
    "Entertainment",
    "Sports",
    "Food ",
    "Outdoor",
    "Gaming ",
  ];

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 100, margin: "auto" }}>
      <FormControl required>
        <InputLabel>category</InputLabel>
        <Select value={category} onChange={handleChange}>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function StartEndDateTimePicker({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
        <Box sx={{ display: "flex", gap: 5 }}>
          <DateTimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
          />
          <DateTimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
          />
        </Box>
      </DemoContainer>
    </LocalizationProvider>
  );
}

function FileUpload({ file, setFile }) {
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  // Handle file input change
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Convert FileList to an array and update state
      setFile(selectedFile);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        type="button"
        startIcon={<CloudUploadIcon />}
      >
        Upload image
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>
      {file && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={URL.createObjectURL(file)}
            alt={`Uploaded`}
            style={{ maxWidth: "100%", height: "auto", maxHeight: "200px" }}
          />
        </Box>
      )}
    </Box>
  );
}

const eventDescriptionFiller =
  "This group is for anyone looking to improve their core strength and flexibility through the practice of Vinyasa yoga in Kitchener. Whether you are a beginner or an experienced yogi, all are welcome to join us as we work on expanding our abilities and deepening our practice. We will focus on strengthening the core muscles, building endurance, and increasing flexibility to improve overall physical and mental well-being. Come join us for an energizing and empowering flow that will leave you feeling stronger and more centered. Let's come together to support and motivate each other on our journey to core strength!";
