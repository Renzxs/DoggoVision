function Card({name, probability}) {
    return (
        <div className="border-2 mt-4 p-4 hover:bg-black hover:text-white">
            <h1 className="uppercase font-bold">{name}</h1>
            <p>Probability: {probability}</p>
        </div>
    )
}

export default Card;