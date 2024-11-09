import { useAppContext } from "../hooks/useAppContext";

interface CardData {
  id: string;
  title: string;
  description: string;
}

interface InfoCardsProps {
  cards: CardData[];
}

const InfoCards = ({ cards }: InfoCardsProps) => {
  const { state, setState } = useAppContext();

  const passiveState =
    "text-neutral-500 select-none cursor-pointer flex flex-col gap-1 w-[32%] bg-transparent hover:text-black duration-150 ease-in-out";
  const activeState =
    "text-black select-none cursor-pointer flex flex-col gap-1 w-[32%] bg-transparent";
  return (
    <>
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={
            state.physicsState === card.id ? activeState : passiveState
          }
          onClick={() => {
            if (
              card.id === "float" ||
              card.id === "bounce" ||
              card.id === "cycle"
            ) {
              setState({ ...state, physicsState: card.id });
            } else {
              console.error(`Invalid physics state: ${card.id}`);
            }
          }}
        >
          <h1 className={`slide-up${index + 1} text-[0.8rem] font-bold`}>
            {card.title}
          </h1>
          <p className={`slide-up${index + 1} text-[0.6rem]`}>
            {card.description}
          </p>
        </div>
      ))}
    </>
  );
};

export default InfoCards;
