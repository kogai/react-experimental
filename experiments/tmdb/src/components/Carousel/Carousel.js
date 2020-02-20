import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import left from '../../lib/arrow-left-bold.svg';
import right from '../../lib/arrow-right-bold.svg';

// The properties inside the .unordered_list class is crucial for
// achieving the native, fluid scroll behavior.
import css from './Carousel.module.css';

///////////////////////////////////////////////////////////////////////////////
// CAROUSEL
// --------
// This is a simple, clean React carousel component which uses React hooks and
// native Web APIs to achieve native fluidity for horizontal scrolling on
// touchscreen devices. The Button component is visible to use when scrolling
// on devices that lack touchscreen capabilities.
// --------
// Inspiration: Airbnb & Google
///////////////////////////////////////////////////////////////////////////////

/**
 * This prop is used to set the buttons' top CSS property
 * — the vertical position of a positioned element.
 */
Carousel.propTypes = {
  top: PropTypes.number
};

export default function Carousel(props) {
  // To keep track of or set the Carousel's current scroll position
  const [xAxis, setXAxis] = useState(0);
  const unorderedListEl = useRef(null);

  return (
    <div className={css.container}>
      <Button
        orientation="L"
        unOrderedListRef={unorderedListEl}
        xAxis={xAxis}
        setXAxis={setXAxis}
        top={props.top}
      />
      <ul ref={unorderedListEl} className={css.unordered_list}>
        {props.children}
      </ul>
      <Button
        orientation="R"
        unOrderedListRef={unorderedListEl}
        xAxis={xAxis}
        setXAxis={setXAxis}
        top={props.top}
      />
    </div>
  );
}

function Button(props) {
  const [show, setShow] = useState(false);
  const buttonEl = useRef(null);

  const { unOrderedListRef, xAxis } = props;
  const L_Boolean = props.orientation === 'L';

  useEffect(() => {
    function showButtons() {
      if (L_Boolean) {
        // if scrolled past beginning of the Carousel
        //  width, show the left button
        if (xAxis > 0) {
          setShow(true);
        } else {
          setShow(false);
        }
      } else {
        // scroll width; total width of Carousel
        const sW = unOrderedListRef.current.scrollWidth;
        // client width; inner width of Carousel (dependent on viewport)
        const cW = unOrderedListRef.current.clientWidth;

        // if current scroll is not at the end of the Carousel
        // width, show the right button
        if (xAxis < sW - cW) {
          setShow(true);
        } else {
          setShow(false);
        }
      }
    }

    // if device has a touch screen, show the buttons
    if (!window.matchMedia('(pointer: coarse)').matches) {
      showButtons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xAxis]);

  function scroll() {
    // scroll width; total width of Carousel
    const sW = unOrderedListRef.current.scrollWidth;
    // client width; inner width of Carousel (dependent on viewport)
    const cW = unOrderedListRef.current.clientWidth;
    // child width; width of each child in Carousel
    const chW = sW / unOrderedListRef.current.childElementCount;

    const scrollDirection = L_Boolean ? -1 : 1;
    // scroll approximately half the number of children currently present
    // in the client width; e.g., if 6 movie posters are present in the
    // client width, then each onClick will scroll a length of 3 movie posters
    const scrollXAxis = Math.ceil(cW / 2 / chW) * chW * scrollDirection;
    // current xAxis position +/- calculated scroll length
    const nextXAxis = xAxis + scrollXAxis;

    /**
     * element.scrollTo(); scroll to a particular set of coordinates inside
     * of a given element.
     */
    unOrderedListRef.current.scrollTo({
      top: 0,
      left: nextXAxis,
      behavior: 'smooth'
    });

    props.setXAxis(nextXAxis);
  }

  /**
   * On pointer release, remove keyboard focus from the button element.
   */
  function blur() {
    buttonEl.current.blur();
  }

  return (
    show && (
      <button
        ref={buttonEl}
        className={css.button}
        onClick={scroll}
        onPointerUp={blur}
        style={{
          ...(L_Boolean ? { left: '-1.6rem' } : { right: '-1.6rem' }),
          ...{ top: `${props.top}px` }
        }}
      >
        <img
          src={L_Boolean ? left : right}
          alt={`${L_Boolean ? 'left' : 'right'} carousel scroll button`}
        />
      </button>
    )
  );
}
