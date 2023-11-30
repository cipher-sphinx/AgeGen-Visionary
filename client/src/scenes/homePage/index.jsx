import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";

import Banner from "assets/Banner.svg";
import Footer from "assets/Footer.svg";

function HomePage() {
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPredictionError, setIsPredicionError] = useState(false);

  const webcamRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has a valid token here
    const token = localStorage.getItem("token"); // Get the token from local storage
    if (token) {
      // You might want to validate the token on the server here
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate("/"); // Redirect to the login page if not authenticated
    }
  }, [navigate]);

  const handleImageChange = async (event) => {
    const selectedImage = event.target.files[0];
    setWebcamEnabled(false); // Disable the webcam
    setCapturing(false); // Reset capturing state
    setAge(null);
    setGender(null);

    if (!selectedImage) {
      return;
    }

    setImageFile(null); // Clear the captured webcam image

    const formData = new FormData();
    formData.append("files", selectedImage);

    try {
      const response = await axios.post(
        "http://localhost:8000/predict/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.length > 0) {
        const data = response.data[0];
        setAge(data.age);
        setGender(data.gender);
        setImageFile(URL.createObjectURL(selectedImage));
      } else {
        alert("Error predicting age and gender.");
        setImageFile(URL.createObjectURL(selectedImage));
      }
    } catch (error) {
      setIsPredicionError("No face detected in the image");
      setImageFile(URL.createObjectURL(selectedImage));
    }
  };

  const handleCapture = async () => {
    if (webcamEnabled) {
      // Capturing from webcam
      if (!webcamRef.current) {
        return;
      }

      const capturedImage = webcamRef.current.getScreenshot();

      if (!capturedImage) {
        alert("Error capturing image from webcam.");
        return;
      }

      setImageFile(capturedImage);

      const formData = new FormData();
      formData.append(
        "files",
        dataURItoBlob(capturedImage),
        "webcam_capture.png"
      );

      try {
        const response = await axios.post(
          "http://localhost:8000/predict/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.length > 0) {
          const data = response.data[0];
          setAge(data.age);
          setGender(data.gender);
        } else {
          alert("Error predicting age and gender.");
        }
      } catch (error) {
        console.error("Error:", error);
      }

      setWebcamEnabled(false); // Disable webcam after capture
      setCapturing(false); // Reset capturing state
    } else {
      // Enabling webcam for capture
      setWebcamEnabled(true);
      setAge(null);
      setGender(null);
      setImageFile(null);
      setCapturing(true); // Set capturing state
    }
  };

  // Function to convert data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  console.log(isPredictionError);

  return (
    <div className="App text-center h-screen">
      <div className="flex justify-end">
        <button
          className="bg-Quaternary mr-4 mt-2 rounded-lg px-4 text-lg hover:bg-Tertiary"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
      <div className="font-black text-3xl flex justify-center">
        <img alt="Banner" src={Banner} />
      </div>
      <div className="mt-10 flex justify-center">
        <label className="border-dashed border-4 border-Quaternary rounded-lg px-4 py-2 text-sm bg-Primary">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          Upload an Image
        </label>
        <button
          onClick={handleCapture}
          className="bg-Tertiary rounded-lg px-4 py-2 text-sm ml-8 text-Quaternary border-b-4 border-Secondary"
        >
          {webcamEnabled
            ? capturing
              ? "Click to Take Pic.."
              : "Capture Image on Webcam"
            : "Capture from Webcam"}
        </button>
      </div>
      <div
        className="flex justify-between items-end"
        style={{ position: "absolute", bottom: "0", left: "0", right: "0" }}
      >
        <div>
          <img alt="footer" src={Footer} />
        </div>

        <div
          className="flex justify-center items-center"
          style={{ position: "absolute", right: "590px", top: "-270px" }}
        >
          {" "}
          {/* Center image */}
          {webcamEnabled ? (
            <Webcam
              audio={false}
              height={350}
              width={350}
              ref={webcamRef}
              screenshotFormat="image/png"
              style={{
                width: "350px",
                height: "350px",
                objectFit: "cover",
                borderRadius: "20px",
                border: "4px solid #EAEAEA",
              }}
            />
          ) : (
            imageFile && (
              <img
                src={imageFile}
                alt="Facial"
                style={{
                  width: "350px",
                  height: "350px",
                  objectFit: "cover",
                  borderRadius: "20px",
                  border: "4px solid #EAEAEA",
                }}
              />
            )
          )}
        </div>

        <div
          className="m-4 font-black text-3xl w-3/12"
          style={{ position: "absolute", right: "50px", top: "-160px" }}
        >
          {age !== null && gender !== null ? (
            <div>
              <h2 className="mb-2">🤖 Prediction</h2>
              <p className="fade-in ">
                <span>Age: </span>
                <span style={{ color: "#FF2E63" }}>{age}</span>,{" "}
                <span>Gender: </span>
                <span style={{ color: "#FF2E63" }}>{gender}</span>
              </p>
            </div>
          ) : (
            <p>{isPredictionError}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
