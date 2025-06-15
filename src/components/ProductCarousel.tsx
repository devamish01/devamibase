import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "./ui/button";

interface ProductCarouselProps {
  images: string[];
  title: string;
}

export default function ProductCarousel({
  images,
  title,
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 group">
        <img
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? "scale-110" : "scale-100"
          }`}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 text-slate-900 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 text-slate-900 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white/90 text-slate-900 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <ZoomIn className="h-5 w-5" />
        </Button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? "border-primary-500 shadow-lg scale-105"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dots Indicator (for mobile) */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-primary-500 w-6"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
