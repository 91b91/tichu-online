import React, { useState, useEffect, useRef } from 'react';
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

  // Maintain a client-side prefered order of the cards
  const localOrderRef = useRef([]);

  useEffect(() => {
    if (currentUser?.hand) {
      const serverCards = currentUser.hand;
      
      // If we don't have a local order yet, initialize it
      if (localOrderRef.current.length === 0) {
        localOrderRef.current = serverCards.map(card => card.id);
      }

      // Create a map of server cards by ID for easy lookup
      const serverCardsMap = new Map(
        serverCards.map(card => [card.id, card])
      );

      // Filter out any IDs that no longer exist in the server cards
      localOrderRef.current = localOrderRef.current.filter(
        id => serverCardsMap.has(id)
      );

      // Add any new cards from the server to the end of local order
      serverCards.forEach(card => {
        if (!localOrderRef.current.includes(card.id)) {
          localOrderRef.current.push(card.id);
        }
      });

      // Create the cards array using the local order
      const orderedCards = localOrderRef.current
        .map(id => serverCardsMap.get(id))
        .filter(Boolean)
        .map(card => ({
          ...card,
          imagePath: `./card-assets/tichu-card-${card.id}.png`,
          selected: false,
          name: `${card.suit} ${card.value}`
        }));

      setCards(orderedCards);
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
      const newCards = arrayMove(cards, oldIndex, newIndex);
      
      // Update the local order reference
      localOrderRef.current = newCards.map(card => card.id);
      
      return newCards;
    });
  };

  // Rest of the component remains the same...
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

      selectCards(newCards.filter(card => card.selected));
      return newCards;
    });

    updateLastSelectedIndex(index);
  };

  return (
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

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onCardClick(e);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`card-wrapper ${card.selected ? 'selected' : ''} ${
        isDragging ? 'dragging' : ''
      }`}
      style={cardStyle}
      data-index={index}
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