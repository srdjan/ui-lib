// JSX Type Definitions for ui-lib
// Comprehensive type definitions for HTML elements, attributes, and ui-lib specific features

declare global {
  namespace JSX {
    // JSX Element structure
    interface Element {
      type: string | ((props: any) => Element);
      props: Record<string, any> | null;
      key?: string | number | null;
    }

    // Base HTML attributes
    interface HTMLAttributes {
      // Global attributes
      id?: string;
      class?: string;
      className?: string; // React-style alias
      style?: string | Record<string, string | number>;
      title?: string;
      lang?: string;
      dir?: 'ltr' | 'rtl' | 'auto';
      hidden?: boolean;
      tabIndex?: number;
      contentEditable?: boolean | 'true' | 'false';
      draggable?: boolean;
      spellcheck?: boolean;
      translate?: 'yes' | 'no';

      // Data attributes (for ui-lib state management)
      [key: `data-${string}`]: any;

      // ARIA attributes (for accessibility)
      role?: string;
      [key: `aria-${string}`]: any;

      // HTMX attributes (for ui-lib API integration)
      [key: `hx-${string}`]: string;

      // Event handlers (SSR-compatible string format)
      onClick?: string;
      onSubmit?: string;
      onChange?: string;
      onInput?: string;
      onFocus?: string;
      onBlur?: string;
      onMouseEnter?: string;
      onMouseLeave?: string;
      onKeyDown?: string;
      onKeyUp?: string;
      onLoad?: string;

      // ui-lib specific event handling
      onAction?: string | object | any[];
    }

    // Form element attributes
    interface FormHTMLAttributes extends HTMLAttributes {
      action?: string;
      method?: 'get' | 'post' | 'dialog';
      enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
      novalidate?: boolean;
      target?: '_blank' | '_self' | '_parent' | '_top' | string;
    }

    interface InputHTMLAttributes extends HTMLAttributes {
      type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'datetime-local' | 'time' | 'month' | 'week' | 'color' | 'file' | 'range' | 'checkbox' | 'radio' | 'submit' | 'reset' | 'button' | 'hidden';
      value?: string | number | readonly string[];
      defaultValue?: string | number | readonly string[];
      placeholder?: string;
      name?: string;
      required?: boolean;
      disabled?: boolean;
      readonly?: boolean;
      checked?: boolean;
      defaultChecked?: boolean;
      multiple?: boolean;
      min?: string | number;
      max?: string | number;
      step?: string | number;
      pattern?: string;
      autocomplete?: string;
      autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters';
      autocorrect?: 'on' | 'off';
      size?: number;
      maxlength?: number;
      minlength?: number;
      accept?: string;
      alt?: string;
      src?: string;
      width?: string | number;
      height?: string | number;
      list?: string;
      form?: string;
    }

    interface TextareaHTMLAttributes extends HTMLAttributes {
      value?: string;
      defaultValue?: string;
      placeholder?: string;
      name?: string;
      required?: boolean;
      disabled?: boolean;
      readonly?: boolean;
      rows?: number;
      cols?: number;
      maxlength?: number;
      minlength?: number;
      wrap?: 'hard' | 'soft' | 'off';
      autocomplete?: string;
      form?: string;
    }

    interface ButtonHTMLAttributes extends HTMLAttributes {
      type?: 'button' | 'submit' | 'reset';
      disabled?: boolean;
      form?: string;
      formaction?: string;
      formenctype?: string;
      formmethod?: string;
      formnovalidate?: boolean;
      formtarget?: string;
      name?: string;
      value?: string;
    }

    interface SelectHTMLAttributes extends HTMLAttributes {
      value?: string | readonly string[];
      defaultValue?: string | readonly string[];
      multiple?: boolean;
      name?: string;
      required?: boolean;
      disabled?: boolean;
      size?: number;
      autocomplete?: string;
      form?: string;
    }

    interface OptionHTMLAttributes extends HTMLAttributes {
      value?: string | readonly string[] | number;
      selected?: boolean;
      disabled?: boolean;
      label?: string;
    }

    interface LabelHTMLAttributes extends HTMLAttributes {
      for?: string;
      form?: string;
    }

    // Link and media attributes
    interface AnchorHTMLAttributes extends HTMLAttributes {
      href?: string;
      target?: '_blank' | '_self' | '_parent' | '_top';
      rel?: string;
      download?: boolean | string;
      hreflang?: string;
      type?: string;
      referrerpolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
    }

    interface ImgHTMLAttributes extends HTMLAttributes {
      src?: string;
      alt?: string;
      width?: string | number;
      height?: string | number;
      loading?: 'lazy' | 'eager';
      decoding?: 'async' | 'sync' | 'auto';
      srcset?: string;
      sizes?: string;
      crossorigin?: 'anonymous' | 'use-credentials' | '';
      referrerpolicy?: string;
      usemap?: string;
      ismap?: boolean;
    }

    interface VideoHTMLAttributes extends HTMLAttributes {
      src?: string;
      poster?: string;
      controls?: boolean;
      autoplay?: boolean;
      loop?: boolean;
      muted?: boolean;
      preload?: 'none' | 'metadata' | 'auto';
      width?: string | number;
      height?: string | number;
      crossorigin?: 'anonymous' | 'use-credentials';
    }

    interface AudioHTMLAttributes extends HTMLAttributes {
      src?: string;
      controls?: boolean;
      autoplay?: boolean;
      loop?: boolean;
      muted?: boolean;
      preload?: 'none' | 'metadata' | 'auto';
      crossorigin?: 'anonymous' | 'use-credentials';
    }

    // Table attributes
    interface TableHTMLAttributes extends HTMLAttributes {
      cellpadding?: string | number;
      cellspacing?: string | number;
      summary?: string;
    }

    interface TdHTMLAttributes extends HTMLAttributes {
      colspan?: number;
      rowspan?: number;
      headers?: string;
      scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
    }

    interface ThHTMLAttributes extends HTMLAttributes {
      colspan?: number;
      rowspan?: number;
      headers?: string;
      scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
      abbr?: string;
    }

    // Meta and head attributes
    interface MetaHTMLAttributes extends HTMLAttributes {
      name?: string;
      content?: string;
      charset?: string;
      httpEquiv?: 'content-security-policy' | 'content-type' | 'default-style' | 'refresh';
      property?: string;
    }

    interface LinkHTMLAttributes extends HTMLAttributes {
      href?: string;
      rel?: string;
      type?: string;
      media?: string;
      hreflang?: string;
      sizes?: string;
      as?: string;
      crossorigin?: 'anonymous' | 'use-credentials';
      integrity?: string;
      referrerpolicy?: string;
    }

    interface ScriptHTMLAttributes extends HTMLAttributes {
      src?: string;
      type?: string;
      async?: boolean;
      defer?: boolean;
      crossorigin?: 'anonymous' | 'use-credentials';
      integrity?: string;
      nomodule?: boolean;
      nonce?: string;
      referrerpolicy?: string;
      dangerouslySetInnerHTML?: { __html: string };
    }

    interface StyleHTMLAttributes extends HTMLAttributes {
      type?: string;
      media?: string;
      nonce?: string;
      scoped?: boolean;
      dangerouslySetInnerHTML?: { __html: string };
    }

    // Map HTML elements to their attribute types
    interface IntrinsicElements {
      // Document structure
      html: HTMLAttributes & { manifest?: string };
      head: HTMLAttributes;
      body: HTMLAttributes;
      title: HTMLAttributes;
      base: HTMLAttributes & { href?: string; target?: string };

      // Metadata
      meta: MetaHTMLAttributes;
      link: LinkHTMLAttributes;
      style: StyleHTMLAttributes;
      script: ScriptHTMLAttributes;

      // Layout and semantic elements
      div: HTMLAttributes;
      span: HTMLAttributes;
      header: HTMLAttributes;
      footer: HTMLAttributes;
      main: HTMLAttributes;
      section: HTMLAttributes;
      article: HTMLAttributes;
      aside: HTMLAttributes;
      nav: HTMLAttributes;
      details: HTMLAttributes & { open?: boolean };
      summary: HTMLAttributes;

      // Text content
      h1: HTMLAttributes;
      h2: HTMLAttributes;
      h3: HTMLAttributes;
      h4: HTMLAttributes;
      h5: HTMLAttributes;
      h6: HTMLAttributes;
      p: HTMLAttributes;
      blockquote: HTMLAttributes & { cite?: string };
      pre: HTMLAttributes;
      code: HTMLAttributes;
      em: HTMLAttributes;
      strong: HTMLAttributes;
      small: HTMLAttributes;
      s: HTMLAttributes;
      cite: HTMLAttributes;
      q: HTMLAttributes & { cite?: string };
      dfn: HTMLAttributes;
      abbr: HTMLAttributes;
      time: HTMLAttributes & { datetime?: string };
      var: HTMLAttributes;
      samp: HTMLAttributes;
      kbd: HTMLAttributes;
      sub: HTMLAttributes;
      sup: HTMLAttributes;
      i: HTMLAttributes;
      b: HTMLAttributes;
      u: HTMLAttributes;
      mark: HTMLAttributes;
      ruby: HTMLAttributes;
      rt: HTMLAttributes;
      rp: HTMLAttributes;
      bdi: HTMLAttributes;
      bdo: HTMLAttributes;

      // Lists
      ul: HTMLAttributes;
      ol: HTMLAttributes & { reversed?: boolean; start?: number; type?: '1' | 'a' | 'A' | 'i' | 'I' };
      li: HTMLAttributes & { value?: number };
      dl: HTMLAttributes;
      dt: HTMLAttributes;
      dd: HTMLAttributes;

      // Links and media
      a: AnchorHTMLAttributes;
      img: ImgHTMLAttributes;
      video: VideoHTMLAttributes;
      audio: AudioHTMLAttributes;
      source: HTMLAttributes & { src?: string; type?: string; media?: string; sizes?: string; srcset?: string };
      track: HTMLAttributes & { src?: string; kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata'; srclang?: string; label?: string; default?: boolean };

      // Forms
      form: FormHTMLAttributes;
      input: InputHTMLAttributes;
      textarea: TextareaHTMLAttributes;
      button: ButtonHTMLAttributes;
      select: SelectHTMLAttributes;
      option: OptionHTMLAttributes;
      optgroup: HTMLAttributes & { label?: string; disabled?: boolean };
      label: LabelHTMLAttributes;
      fieldset: HTMLAttributes & { disabled?: boolean; form?: string; name?: string };
      legend: HTMLAttributes;
      datalist: HTMLAttributes;
      output: HTMLAttributes & { for?: string; form?: string; name?: string };
      progress: HTMLAttributes & { value?: number; max?: number };
      meter: HTMLAttributes & { value?: number; min?: number; max?: number; low?: number; high?: number; optimum?: number };

      // Tables
      table: TableHTMLAttributes;
      caption: HTMLAttributes;
      colgroup: HTMLAttributes & { span?: number };
      col: HTMLAttributes & { span?: number };
      thead: HTMLAttributes;
      tbody: HTMLAttributes;
      tfoot: HTMLAttributes;
      tr: HTMLAttributes;
      th: ThHTMLAttributes;
      td: TdHTMLAttributes;

      // Interactive elements
      dialog: HTMLAttributes & { open?: boolean };
      menu: HTMLAttributes & { type?: 'context' | 'toolbar' };
      menuitem: HTMLAttributes;

      // Embedded content
      embed: HTMLAttributes & { src?: string; type?: string; width?: string | number; height?: string | number };
      object: HTMLAttributes & { data?: string; type?: string; width?: string | number; height?: string | number; usemap?: string; name?: string; form?: string };
      param: HTMLAttributes & { name?: string; value?: string };
      iframe: HTMLAttributes & { src?: string; srcdoc?: string; name?: string; width?: string | number; height?: string | number; sandbox?: string; allow?: string; allowfullscreen?: boolean; referrerpolicy?: string; loading?: 'lazy' | 'eager' };

      // Graphics and media
      canvas: HTMLAttributes & { width?: string | number; height?: string | number };
      svg: HTMLAttributes & { width?: string | number; height?: string | number; viewBox?: string; xmlns?: string };
      math: HTMLAttributes;

      // Line breaks and separators
      br: HTMLAttributes;
      hr: HTMLAttributes;
      wbr: HTMLAttributes;

      // Template and slot
      template: HTMLAttributes;
      slot: HTMLAttributes & { name?: string };
    }

    // Support for functional components with children
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

export {};