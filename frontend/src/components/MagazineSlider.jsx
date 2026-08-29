import React, { useState } from "react";
import "./MagazineSlider.css";

import img1 from "../images/Atlasia12.jpg";
import img2 from "../images/Atlasia7.jpg";
import img3 from "../images/Atlasia8.jpg";
import img4 from "../images/Atlasia9.jpg";
import img5 from "../images/Atlasia10.jpg";
import img6 from "../images/Atlasia11.jpg";

export default function MagazineSlider() {
  const images = [img1, img2, img3, img4, img5, img6];
  const [current, setCurrent] = useState(0);

  const visibleCards = 3;
  const maxIndex = images.length - visibleCards;

  const nextSlide = () => {
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="magazineSection">
      <div className="printHeader">
        <p className="printKicker">Documents imprimables</p>

        <h2 className="printTitle">
          Prêt à imprimer, du plaisir avec foi et cœur !
        </h2>

        <p className="printText">
          Des tableaux d'émotions aux listes de livres, en passant par des
          citations inspirantes et des coloriages, nos documents à imprimer
          regorgent de créativité et de valeurs. Parfaits pour les salles de
          classe, les moments de calme ou les activités en famille.
        </p>
      </div>

      <div className="sliderShell">
        <button className="sliderArrow left" onClick={prevSlide} type="button">
          &#10094;
        </button>

        <div className="sliderWindow">
          <div
            className="sliderTrack"
            style={{
              transform: `translateX(-${current * (100 / visibleCards)}%)`,
            }}
          >
            {images.map((image, index) => (
              <div className="sliderCard" key={index}>
                <div className="cardInner">
                  <img src={image} alt={`Document ${index + 1}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="sliderArrow right" onClick={nextSlide} type="button">
          &#10095;
        </button>
      </div>

      <div className="sliderDots">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={`dot ${current === index ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>

      <div className="archiveWrap">
        <button className="archiveBtn" type="button">
          Archives Numériques →
        </button>
      </div>
    </section>
  );
}