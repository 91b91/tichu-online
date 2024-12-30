import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableCard = ({ card }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <img 
        src={card.imagePath} 
        alt={card.name}
        style={{
          width: '80px',
          height: '112px',
          margin: '0 2px'
        }}
        draggable="false"
      />
    </div>
  );
};

const Hand = () => {
  const [cards, setCards] = useState([
    { 
      id: '1', 
      name: 'Jade 8',
      imagePath: '/card-assets/tichu-card-jade-8.png'
    },
    { 
      id: '2', 
      name: 'Pagoda 8',
      imagePath: '/card-assets/tichu-card-pagoda-8.png'
    },
    { 
      id: '3', 
      name: 'Sword 3',
      imagePath: '/card-assets/tichu-card-sword-3.png'
    },
    { 
      id: '4', 
      name: 'Star 9',
      imagePath: '/card-assets/tichu-card-star-9.png'
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setCards((cards) => {
      const oldIndex = cards.findIndex(card => card.id === active.id);
      const newIndex = cards.findIndex(card => card.id === over.id);
      return arrayMove(cards, oldIndex, newIndex);
    });
  };

  return (
    <div style={{ padding: '16px' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={cards.map(card => card.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div style={{ 
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
            {cards.map((card) => (
              <SortableCard key={card.id} card={card} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Hand;