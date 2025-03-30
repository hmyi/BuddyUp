import React, { useContext } from "react";
import {
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Box,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Slider,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { AuthContext } from "../AuthContext";
import { LocalizationProvider as MUILocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import CityLocationAutocomplete from "./CityLocationAutoComplete.js";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EventCreation({ open, onClose, setOpenSnackBar }) {
  const { accessToken } = useContext(AuthContext);

  const [step, setStep] = React.useState(0);
  const [eventName, setEventName] = React.useState("");
  const [city, setCity] = React.useState("Waterloo");
  const [category, setCategory] = React.useState("Social");
  const [location, setLocation] = React.useState("");
  const [startTime, setStartTime] = React.useState(dayjs());
  const [endTime, setEndTime] = React.useState(dayjs());
  const [capacity, setCapacity] = React.useState(1);
  const [eventDescription, setEventDescription] = React.useState("");
  const [file, setFile] = React.useState(null);

  const [eventNameError, setEventNameError] = React.useState("");
  const [locationError, setLocationError] = React.useState("");
  const [timeError, setTimeError] = React.useState("");

  function handleClose() {
    handleCleanUp();
    setStep(0);
    onClose();
  }

  function handleCleanUp() {
    setEventName("");
    setCity("Waterloo");
    setCategory("Social");
    setLocation("");
    setStartTime(dayjs());
    setEndTime(dayjs());
    setCapacity(1);
    setEventDescription("");
    setFile(null);
    setEventNameError("");
    setLocationError("");
    setTimeError("");

  function handleNext() {

    if (step === 0 && eventName.trim() === "") {
      setEventNameError("Event name cannot be empty");
      return;
    }
    if (step === 1 && location.trim() === "") {
      setLocationError("Location cannot be empty");
      return;
    }
    if (step < 2) {
      setStep((prev) => prev + 1);
    } else {

      handleClose();
    }
  }

  function handlePrevious() {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  }

  function handleEventNameChange(e) {
    const value = e.target.value;
    if (!value) {
      setEventNameError("Event name cannot be empty");
    } else if (value.length > 200) {
      setEventNameError("Event name cannot exceed 200 characters");
    } else {
      setEventNameError("");
    }
    setEventName(value);
  }


  function handleLocationChange(e) {
    const value = e.target.value;
    if (!value) {
      setLocationError("Location cannot be empty");
    } else if (value.length > 255) {
      setLocationError("Location cannot exceed 255 characters");
    } else {
      setLocationError("");
    }
    setLocation(value);
  }

  
  function handleStartTimeChange(time) {
    setStartTime(time);
    const today = dayjs().endOf("day");

    if (time.isBefore(today)) {
      setTimeError("Start time cannot be in the past");
      return;
    }
    if (time.isAfter(endTime)) {
      setTimeError("Start time cannot be later than end time");
      return;
    }
    setTimeError("");
  }

  function handleEndTimeChange(time) {
    setEndTime(time);
    if (time.isBefore(startTime)) {
      setTimeError("End time cannot be earlier than start time");
      return;
    }
    setTimeError("");
  }

  // Capacity
  function handleCapacityChange(value) {
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    setCapacity(value);
  }

  function handleDescriptionChange() {
    const payload = { title: eventName, description: eventDescription };
    fetch("https://18.226.163.235:8000/api/events/improve/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.improved_description) {
          setEventDescription(data.improved_description);
        }
      })
      .catch((err) => console.log("Error improving description:", err));
  }


  async function handleSubmit(e) {
    e.preventDefault();
    dayjs.extend(utc);

    if (!accessToken) {
      console.error("No access token available!");
      return;
    }

    try {
      const utcStartTime = dayjs(startTime).utc().format();
      const utcEndTime = dayjs(endTime).utc().format();

      const formData = new FormData();
      formData.append("title", eventName);
      formData.append("category", category);
      formData.append("city", city);
      formData.append("location", location);
      formData.append("start_time", utcStartTime);
      formData.append("end_time", utcEndTime);
      formData.append("description", eventDescription);
      formData.append("capacity", capacity);
      if (file) {
        formData.append("event_image", file);
      }

      const response = await axios.post(
        "https://18.226.163.235:8000/api/events/new/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Event created successfully:", response.data);
      setOpenSnackBar({ open: true, msg: "Event created successfully!" });





      handleCleanUp();
      handleClose();
    } catch (error) {
      console.error("Error creating event:", error);
      setOpenSnackBar({ open: true, msg: "Error creating event." });
    }
  }

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            BuddyUp
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Exit
          </Button>
        </Toolbar>
      </AppBar>

      {/* Step indicator */}
      <Box sx={{ mt: 10 }}>
        <HorizontalLinearAlternativeLabelStepper step={step} />
      </Box>

      <form onSubmit={handleSubmit}>
        <Box>
          {step === 0 && (
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
                onChange={handleEventNameChange}
                error={eventNameError !== ""}
                helperText={eventNameError || "200 char max"}
              />

              <CitySelect city={city} setCity={setCity} />
              <CategorySelect category={category} setCategory={setCategory} />
            </Stack>
          )}

          {step === 1 && (
            <Stack
              direction="column"
              spacing={10}
              sx={{
                justifyContent: "space-evenly",
                alignItems: "center",
                marginTop: "5rem",
              }}
            >
              <CityLocationAutocomplete
                city={city}
                location={location}
                setLocation={setLocation}
                locationError={locationError}
                setLocationError={setLocationError}


              />

              <StartEndDateTimePicker
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                timeError={timeError}
                handleStartTimeChange={handleStartTimeChange}
                handleEndTimeChange={handleEndTimeChange}
              />

              <CapacitySlider capacity={capacity} handleCapacityChange={handleCapacityChange} />
            </Stack>
          )}

          {step === 2 && (
            <Stack
              direction="column"
              spacing={10}
              sx={{
                justifyContent: "space-evenly",
                alignItems: "center",
                marginTop: "5rem",
              }}
            >
              <Stack>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Describe your event
                </Typography>

                <TextField
                  sx={{ width: "50rem", margin: "auto" }}
                  label="Event Description"
                  multiline
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />

                <Button variant="contained" onClick={handleDescriptionChange} sx={{ mt: 2 }}>
                  Generate event description with GPT-4o mini
                </Button>
              </Stack>

              <FileUpload file={file} setFile={setFile} />
            </Stack>
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
            disabled={step === 0 || timeError !== "" || locationError !== ""}
            onClick={handlePrevious}
          >
            Previous
          </Button>

          {step < 2 && (
            <Button
              type="button"
              variant="contained"
              onClick={handleNext}
              disabled={eventNameError !== "" || locationError !== "" || timeError !== ""}
            >
              Next
            </Button>
          )}

          {step === 2 && (
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              Create
            </Button>
          )}
        </Stack>
      </form>
    </Dialog>
  );
}


function HorizontalLinearAlternativeLabelStepper({ step }) {
  const steps = ["Basic Information", "Event Details", "Additional Information"];

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


function CapacitySlider({ capacity, handleCapacityChange }) {
  const marks = [
    { value: 10, label: "Small event" },
    { value: 50, label: "Regular event" },
    { value: 100, label: "Big event" },
  ];

  return (
    <Box sx={{ width: 800, margin: "auto", display: "flex", gap: 5 }}>
      <TextField
        label="Capacity"
        type="number"
        value={capacity}
        onChange={(e) => handleCapacityChange(Number(e.target.value))}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <Slider
        aria-label="CapacitySlider"
        valueLabelDisplay="auto"
        marks={marks}
        value={capacity}
        onChange={(e) => handleCapacityChange(Number(e.target.value))}
      />
    </Box>
  );
}

function CitySelect({ city, setCity }) {
  const cities = ["Waterloo", "Kitchener", "Toronto"];

  return (
    <FormControl sx={{ width: 150 }}>
      <InputLabel>City</InputLabel>
      <Select label="City" value={city} onChange={(e) => setCity(e.target.value)}>
        {cities.map((cty) => (
          <MenuItem key={cty} value={cty}>
            {cty}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function CategorySelect({ category, setCategory }) {
  const categories = ["Social", "Entertainment", "Sports", "Food", "Outdoor", "Gaming", "Carpool"];

  return (
    <Box sx={{ minWidth: 100, margin: "auto" }}>
      <FormControl sx={{ width: 150 }}>
        <InputLabel>Category</InputLabel>
        <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
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
  timeError,
  handleStartTimeChange,
  handleEndTimeChange,
}) {
  return (
    <MUILocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateTimePicker", "DateTimePicker"]}>
        <Box
          sx={{
            display: "flex",
            gap: 5,
            padding: 3,
            borderRadius: 2,
            border: timeError ? 2 : 0,
            borderColor: "error.main",
          }}
        >
          <DateTimePicker label="Start Time" value={startTime} onChange={handleStartTimeChange} />
          <DateTimePicker label="End Time" value={endTime} onChange={handleEndTimeChange} />
        </Box>
        {timeError && (
          <Typography variant="body1" color="error">
            {timeError}
          </Typography>
        )}
      </DemoContainer>
    </MUILocalizationProvider>
  );
}

// File upload
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
        Upload image
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>
      {file && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded"
            style={{ maxWidth: "100%", height: "auto", maxHeight: "200px" }}
          />
        </Box>
      )}
    </Box>
  );
}
