import React, { useState, useEffect } from 'react';
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

export function Hand() {
  const [cards, setCards] = useState([
    { id: '1', name: 'Jade 8', imagePath: '/card-assets/tichu-card-jade-8.png', selected: false },
    { id: '2', name: 'Pagoda 8', imagePath: '/card-assets/tichu-card-pagoda-8.png', selected: false },
    { id: '3', name: 'Sword 3', imagePath: '/card-assets/tichu-card-sword-3.png', selected: false },
    { id: '4', name: 'Star 9', imagePath: '/card-assets/tichu-card-star-9.png', selected: false },
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setCards(cards => cards.map(card => ({
          ...card,
          selected: false
        })));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
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

  const handleCardClick = (index, event) => {
    if (event.detail === 0) return;
    
    setCards(cards.map((card, i) => ({
      ...card,
      selected: i === index ? !card.selected : card.selected
    })));
  };

  const selectedCards = cards.filter(card => card.selected);

  return (
    <div>
      <div className="hand-container">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={cards.map(card => card.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="cards-row">
              {cards.map((card, index) => (
                <SortableCard
                  key={card.id}
                  card={card}
                  index={index}
                  totalCards={cards.length}
                  onCardClick={(e) => handleCardClick(index, e)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <div className="selected-cards">
        Selected cards: {selectedCards.length > 0 
          ? selectedCards.map(card => card.name).join(', ') 
          : 'None'}
      </div>
    </div>
  );
}

const SortableCard = ({ card, index, totalCards, onCardClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    zIndex: isDragging ? 9999 : index,
    marginLeft: index === 0 ? '0' : '-50px',
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onCardClick(e);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`card-wrapper ${card.selected ? 'selected' : ''}`}
    >
      <img
        src={card.imagePath}
        alt={card.name}
        className="card-image"
        draggable="false"
        onClick={handleClick}
      />
    </div>
  );
};