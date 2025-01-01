// Hand.js
import React, { useState, useEffect } from 'react';
import { useUser } from "../contexts/UserContext";
import { useCardSelection } from '../contexts/CardSelectionContext';
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
  const { currentUser } = useUser();
  const [cards, setCards] = useState([]);
  const { 
    selectCards, 
    clearSelection, 
    lastSelectedIndex, 
    updateLastSelectedIndex 
  } = useCardSelection();

  // Initialize cards with server data and add selected property
  useEffect(() => {
    if (currentUser?.hand) {
      setCards(currentUser.hand.map(card => ({
        ...card,
        imagePath: `./card-assets/tichu-card-${card.id}.png`,
        selected: false,
        name: `${card.suit} ${card.value}`
      })));
    }
  }, [currentUser?.hand]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setCards(cards => cards.map(card => ({
          ...card,
          selected: false
        })));
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection]);

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

    setCards(cards => {
      let newCards;
      if (event.shiftKey && lastSelectedIndex !== null) {
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        
        newCards = cards.map((card, i) => ({
          ...card,
          selected: i >= start && i <= end ? true : card.selected
        }));
      } else {
        newCards = cards.map((card, i) => ({
          ...card,
          selected: i === index ? !card.selected : card.selected
        }));
      }

      // Update the selected cards in the context
      selectCards(newCards.filter(card => card.selected));
      return newCards;
    });

    updateLastSelectedIndex(index);
  };

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
    marginLeft: index === 0 ? '0' : '-88px',
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
}