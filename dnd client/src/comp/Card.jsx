const Card = ({ task }) => {
  return (
    <div className="p-3 border border-gray-200 rounded">
      <h3 className="text-lg font-medium">{task.task}</h3>
      <p className="text-sm">{task.description}</p>
    </div>
  );
};

export default Card;
