import { useState } from "react";

function Card({ title, text, image }) {
  const [count, setCount] = useState(0);

  return (
    <article className="product">
      <img className="thumb" src={image} alt={title} width="400" height="500" />
      <h3>{title}</h3>
      <p className="price">{text}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        ♥ {count}
      </button>
    </article>
  );
}

export default Card;