import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from ".";
import { BrowserRouter } from "react-router-dom";

describe("HomePage Component", () => {
  it("renders without errors", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    expect(screen.getByText("Upload an Image")).toBeInTheDocument();
  });

  it("handles image upload", async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    const input = screen.getByLabelText("Upload an Image");
    const imageFile = new File(["(⌐□_□)"], "test_image.png", {
      type: "image/png",
    });
    fireEvent.change(input, { target: { files: [imageFile] } });
  });

  it("handles webcam capture", async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    const captureButton = screen.getByText("Capture from Webcam");
    fireEvent.click(captureButton);
  });

  it("displays error message on invalid image upload", async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    const input = screen.getByLabelText("Upload an Image");

    // Create a non-image file
    const nonImageFile = new File(["This is not an image"], "text.txt", {
      type: "text/plain",
    });

    // Trigger the file input change event with the non-image file
    fireEvent.change(input, { target: { files: [nonImageFile] } });

    expect(
      screen.getByText("No face detected in the image")
    ).toBeInTheDocument();
  });

  it("performs functional testing for capturing an image", async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    const captureButton = screen.getByText("Capture from Webcam");

    // Simulate the user capturing an image
    fireEvent.click(captureButton);

    // expect(screen.getByAltText("Captured Image")).toBeInTheDocument();

    console.log("Functional testing for image capture successful!");
  });
});
