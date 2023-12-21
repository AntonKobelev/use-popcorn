import { useState } from "react";
import PropTypes from "prop-types";

const containerStyle = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
};

const starContainerStyle = {
  display: "flex",
  gap: "4px",
};

StarRaiting.propTypes = {
  maxRaiting: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  initialRaiting: PropTypes.number,
  onSetRaitingTest: PropTypes.func,
  messages: PropTypes.array,
};

export default function StarRaiting({
  maxRaiting = 5,
  color = "#ffd700",
  size = 25,
  initialRaiting = 0,
  onSetRaitingTest,
  messages = [],
}) {
  const [raiting, setRaiting] = useState(initialRaiting);
  const [tempRaiting, setTempRaiting] = useState(0);

  const textStyle = {
    lineHeight: "1",
    margin: 0,
    color: color,
    fontSize: `${size / 1.5}px`,
  };

  function handleRate(raiting) {
    setRaiting(raiting);
    if (onSetRaitingTest) {
      onSetRaitingTest(raiting);
    }
  }
  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRaiting }, (_, index) => (
          <span key={index}>
            <Star
              onRate={() => handleRate(index + 1)}
              full={
                tempRaiting ? tempRaiting >= index + 1 : raiting >= index + 1
              }
              onHoverIn={() => setTempRaiting(index + 1)}
              onHoverOut={() => setTempRaiting(0)}
              color={color}
              size={size}
              messages
            />
          </span>
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRaiting
          ? messages[tempRaiting ? tempRaiting - 1 : raiting - 1]
          : tempRaiting || raiting || ""}
      </p>
    </div>
  );
}

function Star({ onRate, full, onHoverIn, onHoverOut, color, size }) {
  const starStyle = {
    height: `${size}px`,
    width: `${size}px`,
    cursor: "pointer",
    display: "block",
  };

  return (
    <span
      role="button"
      onClick={onRate}
      style={starStyle}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          style={starStyle}
          role="button"
          onClick={onRate}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
