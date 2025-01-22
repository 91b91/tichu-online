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
const FLIP_DELAY = 50; // milliseconds between each card flip
const FIRST_PHASE_COUNT = 8;
const SECOND_PHASE_COUNT = 6;

const createCardImagePath = (cardId) => `${CARD_ASSET_PATH}/tichu-card-${cardId}.png`;

function StaticCard({ card, index, onFlip }) {
  return (
    <div 
      className="card-wrapper static unflipped-card"
      data-index={index}
    >
      <img
        src={`${CARD_ASSET_PATH}/tichu-card-back-red.png`}
        alt="Card Back"
        className="card-image"
        draggable="false"
        onClick={onFlip}
      />
    </div>
  );
}

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
      className={`card-wrapper flipped-card ${card.selected ? 'selected' : ''} ${
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
  const [visibleCardIds, setVisibleCardIds] = useState(new Set());
  const [cards, setCards] = useState([]);
  const [flipPhase, setFlipPhase] = useState(0); // 0 = none, 1 = first 8, 2 = all
  const { 
    selectCards, 
    clearSelection, 
    lastSelectedIndex, 
    updateLastSelectedIndex 
  } = useCardSelection();
  const localOrderRef = useRef([]);
  const isFlippingRef = useRef(false);

  // Handle initial cards and updates
  useEffect(() => {
    if (!currentUser?.hand) return;
    
    const serverCards = currentUser.hand.map(card => ({
      ...card,
      selected: false
    }));
    
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

    // Apply the order to the cards
    const orderedCards = localOrderRef.current
      .map(id => serverCards.find(card => card.id === id))
      .filter(Boolean);

    setCards(orderedCards);
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
        distance: DRAG_ACTIVATION_DISTANCE,
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
      
      localOrderRef.current = newCards.map(card => card.id);
      return newCards;
    });
  };

  const handleCardClick = (visibleIndex, event) => {
    if (event.detail === 0) return;

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

  const handleFlipCards = () => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;

    let cardsToFlip;
    if (flipPhase === 0) {
      cardsToFlip = cards.slice(0, FIRST_PHASE_COUNT);
      setFlipPhase(1);
    } else if (flipPhase === 1) {
      cardsToFlip = cards.slice(FIRST_PHASE_COUNT, FIRST_PHASE_COUNT + SECOND_PHASE_COUNT);
      setFlipPhase(2);
    } else {
      isFlippingRef.current = false;
      return;
    }

    cardsToFlip.forEach((cardToFlip, index) => {
      setTimeout(() => {
        setVisibleCardIds(prev => {
          const newSet = new Set(prev);
          newSet.add(cardToFlip.id);
          return newSet;
        });

        setCards(prevCards => {
          const cardIndex = prevCards.findIndex(card => card.id === cardToFlip.id);
          const remainingCards = prevCards.filter((_, i) => i !== cardIndex);
          const newCards = [prevCards[cardIndex], ...remainingCards];
          localOrderRef.current = newCards.map(card => card.id);
          
          if (index === cardsToFlip.length - 1) {
            isFlippingRef.current = false;
          }
          
          return newCards;
        });
      }, index * FLIP_DELAY);
    });
  };

  // Split cards based on current order, not original positions
  const visibleCards = [];
  const hiddenCards = [];
  
  // Maintain the current order by iterating through cards array
  cards.forEach(card => {
    if (visibleCardIds.has(card.id)) {
      visibleCards.push(card);
    } else {
      hiddenCards.push(card);
    }
  });

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
              visibleCardIds.has(card.id) ? (
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
                  onFlip={handleFlipCards}
                />
              )
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}