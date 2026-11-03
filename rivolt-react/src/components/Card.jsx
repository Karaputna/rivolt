function Card({ title, text, image }) {
  return (
    <article className="product">
      <img className="thumb" src={image} alt={title} width="400" height="500" />
      <h3>{title}</h3>
      <p className="price">{text}</p>
    </article>
  );
}

export default Card;