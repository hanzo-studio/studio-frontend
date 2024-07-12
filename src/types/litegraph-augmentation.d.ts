import "@comfyorg/litegraph";

/**
 *  ComfyUI extensions of litegraph
 */
declare module "@comfyorg/litegraph" {
  type widgetTypes = "string";

  interface LGraphNode {
    constructor: typeof LGraphNode & { nodeData: ComfyObjectInfo };

    /**
     * Callback fired on each node after the graph is configured
     */
    onAfterGraphConfigured?(): void;

    /**
     * If the node is a frontend only node and should not be serialized into the prompt.
     */
    isVirtualNode?: boolean;

    addDOMWidget<
      TElement extends HTMLElement,
      TValue,
      TOptions extends DOMWidgetOptions,
    >(
      name: string,
      type: string,
      element: TElement,
      options: TOptions
    ): DOMWidget<TElement, TValue, TOptions>;
  }

  interface DOMWidgetOptions<TValue> {
    getValue?(): TValue;
    setValue?(value: TValue): void;
    onHide?(widget: DOMWidget): void;
    beforeResize?(this: DOMWidget, node: LGraphNode): void;
    afterResize?(this: DOMWidget, node: LGraphNode): void;
    hideOnZoom?: boolean;
    selectOn?: string[];
  }

  interface DOMWidget<
    TElement extends HTMLElement = HTMLElement,
    TValue = any,
    TOptions extends DOMWidgetOptions = DOMWidgetOptions,
  > extends IWidget<TValue, TOptions> {
    type: string;
    element: TElement;
    computedHeight?: number;
  }

  interface IWidget<TValue = any, TOptions extends DOMWidgetOptions = any> {
    /**
     * Allows for additional cleanup when removing a widget when converting to input.
     */
    onRemove?(): void;

    /**
     * The DOM element for this widget.
     */
    element?: HTMLElement;

    /**
     * The width of the widget.
     */
    width?: number;

    /**
     * If the widget should be serialized when generating a prompt
     */
    serialize?: boolean;
  }

  interface INodeOutputSlot {
    widget?: unknown;
  }

  interface INodeInputSlot {
    widget?: unknown;
  }

  interface LGraphCanvas {
    /**
     * Changes the background color of the canvas.
     * @param image The image to set as the background
     * @param clear_background_color The color to set as the clear background color
     */
    updateBackground(image: string, clear_background_color: string): void;
  }
}

/**
 * Extended types for litegraph, to be merged upstream once it has stabilized.
 */
declare module "@comfyorg/litegraph" {
  interface INodeInputSlot {
    pos?: [number, number];
  }

  interface LGraphNode {
    widgets_values?: unknown[];
  }

  interface IWidget<TValue = any, TOptions = any> {
    computeSize(): [number, number];
  }

  interface LGraphCanvas {
    default_connection_color_byType: Record<string, string>;
    copyToClipboard(nodes: LGraphNode[]): void;
  }

  interface LGraph {
    add(group: LGraphGroup): void;
  }

  interface LiteGraph {
    LINK_RENDER_MODES: ["Straight", "Linear", "Spline"];

    search_filter_enabled: boolean;
    middle_click_slot_add_default_node: boolean;
    registered_slot_out_types: Record<string, { nodes: string[] }>;
    registered_slot_in_types: Record<string, { nodes: string[] }>;
    slot_types_out: string[];
    slot_types_default_out: Record<string, string[]>;
    slot_types_default_in: Record<string, string[]>;
    pointerListenerAdd(
      element: HTMLElement,
      event: string,
      handler: Function,
      capture: boolean = false
    ): void;
    pointerListenerRemove(
      element: HTMLElement,
      event: string,
      handler: Function,
      capture: boolean = false
    ): void;
  }
}
