import { styled } from "@linaria/react";

// Title on one side, the viewing controls on the other — wrapping on narrow screens with the title first.
export const AlbumHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem 1rem;

  & > h3 {
    margin-inline-end: auto;
  }
`;

// The magnifier controls — size and tint — kept together since both only change how the stamps are viewed.
export const ViewControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;

  & > div {
    min-inline-size: 7rem;
  }
`;

/*
  Hosts the live sprite the stamps <use>. Zero-sized and clipped rather than display: none, since
  browsers won't paint gradients or clip paths defined inside an undisplayed <svg>.
*/
export const SpriteHost = styled.div`
  position: absolute;
  inline-size: 0;
  block-size: 0;
  overflow: hidden;
`;

// The album's rows of mounts — an ordered list, since the order is the sprite's symbol order.
export const StampGrid = styled.ol`
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
  gap: 1.25rem 1rem;
  margin: 0;
  padding: 0.25rem;
  list-style: none;
`;

// What an empty album page says — written in, like a collector's note to self.
export const EmptyPage = styled.p`
  margin: 0;
  padding: 2rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-fg-muted);
  border: 0.125rem dashed var(--album-rule);
  border-radius: 0.25rem;
`;
