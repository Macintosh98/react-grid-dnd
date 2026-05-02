/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useMotionValue, animate } from "motion/react";
import { useContext, useEffect, useRef } from "react";
import { GridItemContext } from "./GridItemContext";
import { useGestureResponder, type StateType } from "./gesture-responder";

export function GridItem({ children, style, className, ...other }: any) {
  const context = useContext(GridItemContext);

  if (!context) {
    throw Error(
      "Unable to find GridItem context. Please ensure that GridItem is used as a child of GridDropZone",
    );
  }

  const {
    top,
    disableDrag,
    endTraverse,
    onStart,
    mountWithTraverseTarget,
    left,
    onMove,
    onEnd,
    grid,
    dragging: isDragging,
  } = context;

  const { columnWidth, rowHeight } = grid;
  const dragging = useRef(false);
  const startCoords = useRef([left, top]);

  // motion values
  const x = useMotionValue(left);
  const y = useMotionValue(top);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(1);
  const zIndex = useMotionValue(0);

  // mount animation setup
  useEffect(() => {
    if (mountWithTraverseTarget) {
      const mountXY = mountWithTraverseTarget;
      endTraverse();

      x.set(mountXY[0]);
      y.set(mountXY[1]);
      scale.set(1.1);
      opacity.set(0.8);
      zIndex.set(1);
    } else {
      x.set(left);
      y.set(top);
      scale.set(1);
      opacity.set(1);
      zIndex.set(0);
    }
  }, []);

  // handle move updates
  function handleMove(state: StateType) {
    const newX = startCoords.current[0] + state.delta[0];
    const newY = startCoords.current[1] + state.delta[1];

    x.set(newX);
    y.set(newY);
    scale.set(1.1);
    opacity.set(0.8);
    zIndex.set(1);

    onMove(state, newX, newY);
  }

  // handle drag end
  function handleEnd(state: StateType) {
    const newX = startCoords.current[0] + state.delta[0];
    const newY = startCoords.current[1] + state.delta[1];

    dragging.current = false;
    onEnd(state, newX, newY);
  }

  const { bind } = useGestureResponder(
    {
      onMoveShouldSet: () => {
        if (disableDrag) return false;

        onStart();
        startCoords.current = [left, top];
        dragging.current = true;
        return true;
      },
      onMove: handleMove,
      onTerminationRequest: () => !dragging.current,
      onTerminate: handleEnd,
      onRelease: handleEnd,
    },
    { enableMouse: true },
  );

  // sync to new grid position when not dragging
  useEffect(() => {
    if (!dragging.current) {
      animate(x, left, { duration: 0.25 });
      animate(y, top, { duration: 0.25 });
      animate(scale, 1, { duration: 0.25 });
      animate(opacity, 1, { duration: 0.25 });
      zIndex.set(0);
    }
  }, [left, top]);

  const props: any = {
    className:
      "GridItem" +
      (isDragging ? " dragging" : "") +
      (disableDrag ? " disabled" : "") +
      (className ? ` ${className}` : ""),
    ...bind,
    style: {
      cursor: disableDrag ? "grab" : undefined,
      position: "absolute",
      width: `${columnWidth}px`,
      height: `${rowHeight}px`,
      boxSizing: "border-box",
      zIndex,
      opacity,
      x,
      y,
      scale,
      ...style,
    },
    ...other,
  };

  return (
    <motion.div {...props}>
      {typeof children === "function" ? children() : children}
    </motion.div>
  );
}
