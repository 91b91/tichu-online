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

const DRAG_ACTIVATION_DISTANCE = 8;
const CARD_ASSET_PATH = './card-assets';

const createCardImagePath = (cardId) => `${CARD_ASSET_PATH}/tichu-card-${cardId}.png`;

// Static card component for face-down cards
function StaticCard({ card, index }) {
  const { currentUser, flipCards } = useUser();

  async function handleStaticCardClick() {
    console.log('Static card clicked:', card);
    try {
      await flipCards(currentUser.userId);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div 
      className="card-wrapper static"
      data-index={index}
      onClick={handleStaticCardClick}
    >
      <img
        src={`${CARD_ASSET_PATH}/tichu-card-back-red.png`}
        alt="Card Back"
        className="card-image"
        draggable="false"
      />
    </div>
  );
}

// Sortable card component for face-up cards that can be dragged and selected
function SortableCard({ card, index, onCardClick }) {
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
        src={createCardImagePath(card.id)}
        alt={`${card.suit} ${card.value}`}
        className="card-image"
        draggable="false"
        onClick={handleClick}
      />
    </div>
  );
}

export function Hand() {
  const { currentUser } = useUser();
  const [cards, setCards] = useState([]);
  const { 
    selectCards, 
    clearSelection, 
    lastSelectedIndex, 
    updateLastSelectedIndex 
  } = useCardSelection();
  const localOrderRef = useRef([]);

  // Handle initial cards and updates while preserving local order
  useEffect(() => {
    if (!currentUser?.hand) return;
    
    const serverCards = currentUser.hand.map(card => ({
      ...card,
      selected: false
    }));
    
    // Initialize local order if empty
    if (localOrderRef.current.length === 0) {
      localOrderRef.current = serverCards.map(card => card.id);
    }

    // Update order for any new cards while preserving existing order
    serverCards.forEach(card => {
      if (!localOrderRef.current.includes(card.id)) {
        localOrderRef.current.push(card.id);
      }
    });

    // Remove any cards that no longer exist
    localOrderRef.current = localOrderRef.current.filter(id => 
      serverCards.some(card => card.id === id)
    );

    // Apply the local order to the cards
    const orderedCards = localOrderRef.current
      .map(id => serverCards.find(card => card.id === id))
      .filter(Boolean);

    setCards(orderedCards);
  }, [currentUser?.hand]);

  // Handle escape key to clear selection
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
        distance: DRAG_ACTIVATION_DISTANCE,
      },
    })
  );

  // Handle drag and drop reordering of face-up cards
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    setCards((cards) => {
      const oldIndex = cards.findIndex(card => card.id === active.id);
      const newIndex = cards.findIndex(card => card.id === over.id);
      const newCards = arrayMove(cards, oldIndex, newIndex);
      
      localOrderRef.current = newCards.map(card => card.id);
      return newCards;
    });
  };

  // Handle card selection with shift-click support
  const handleCardClick = (visibleIndex, event) => {
    if (event.detail === 0) return;

    const visibleCards = cards.filter(card => card.isFaceUp);

    setCards(cards => {
      const targetCard = visibleCards[visibleIndex];
      
      let newCards = cards.map(card => ({
        ...card,
        selected: card.id === targetCard.id ? !card.selected : card.selected
      }));

      if (event.shiftKey && lastSelectedIndex !== null) {
        const lastTargetCard = visibleCards[lastSelectedIndex];
        const currentVisibleIndex = visibleCards.findIndex(card => card.id === targetCard.id);
        const lastVisibleIndex = visibleCards.findIndex(card => card.id === lastTargetCard.id);
        
        const start = Math.min(currentVisibleIndex, lastVisibleIndex);
        const end = Math.max(currentVisibleIndex, lastVisibleIndex);
        
        newCards = cards.map(card => {
          const cardVisibleIndex = visibleCards.findIndex(vc => vc.id === card.id);
          return {
            ...card,
            selected: cardVisibleIndex >= start && cardVisibleIndex <= end ? true : card.selected
          };
        });
      }

      selectCards(newCards.filter(card => card.selected));
      return newCards;
    });

    updateLastSelectedIndex(visibleIndex);
  };

  // Split cards into face-up and face-down based on server state
  const visibleCards = cards.filter(card => card.isFaceUp);
  const hiddenCards = cards.filter(card => !card.isFaceUp);

  return (
    <div className="hand-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleCards.map(card => card.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="cards-row">
            {[...hiddenCards, ...visibleCards].map((card, index) => 
              card.isFaceUp ? (
                <SortableCard
                  key={card.id}
                  card={card}
                  index={index}
                  onCardClick={(e) => handleCardClick(
                    visibleCards.findIndex(c => c.id === card.id),
                    e
                  )}
                />
              ) : (
                <StaticCard
                  key={card.id}
                  card={card}
                  index={index}
                />
              )
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}