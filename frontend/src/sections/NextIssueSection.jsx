import React from "react";
import "./NextIssueSection.css";
import wave from "../images/wave.svg";

export default function NextIssueSection({
  title,
  subtitle,
  subtitleColor,
  text,
  paragraphs = [],
  points = [],
  image,
  video,
  decorImage,
  buttonText,
  buttonLink,
  onClick,
  reverse = false,
  backgroundImage,
  backgroundColor,
  isFifth,
 className = "",
}) {
  return (
  <>
    <section
     className={`next-issue-section ${className}`}
      style={{
        backgroundColor: backgroundColor || "#4DB374",
        ...(backgroundImage && {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }),
      }}
    >
      {/* 🌊 WAVE */}
      <div
        className="wave"
        style={{ backgroundImage: `url(${wave})` }}
      />

      <div className={`content-wrapper ${reverse ? "reverse" : ""}`}>
        <div className="media">
          {video ? (
            <video controls poster={image} className="section-media">
              <source src={video} type="video/mp4" />
            </video>
          ) : image ? (
            <img
              src={image}
              alt={title || "image"}
              className={`section-media ${isFifth ? "fifth-image" : ""}`}
            />
          ) : null}
        </div>

        <div className="text">
          {subtitle && (
            <p
              className="section-subtitle"
              style={subtitleColor ? { color: subtitleColor } : undefined}
            >
              {subtitle}
            </p>
          )}

        {title && (
  <h2>
    {title.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < title.split("\n").length - 1 && <br />}
      </React.Fragment>
    ))}
  </h2>
)}
          {text && <p>{text}</p>}

          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {points.length > 0 && (
            <ul>
              {points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}

          {buttonText &&
            (buttonLink ? (
              <a href={buttonLink} className="section-button">
                {buttonText}
              </a>
            ) : (
              <button onClick={onClick} className="section-button">
                {buttonText}
              </button>
            ))}
        </div>
      </div>
    </section>

    {decorImage && (
      <img src={decorImage} alt="" className="turtle" />
    )}
  </>
);
}