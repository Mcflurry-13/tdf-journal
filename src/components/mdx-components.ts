import { FrontendStudy } from './FrontendStudy';
import { CadViewer, CadGroup } from './CadViewer';
import { InteractionFlow } from './RecordArchive';
import type { MDXComponents } from 'mdx/types';
import {
  Attachment,
  Attachments,
  BeforeAfter,
  Entry,
  Figure,
  FigurePair,
  Gallery,
  ImageGallery,
  ProblemChangeResult,
  Quote,
  Section,
  Specs,
  Status,
  Video,
  VideoGroup,
} from './blocks';
import { CodeBlock, Pre } from './CodeBlock';

/** Everything a week MDX file may use without importing. */
export const mdxComponents: MDXComponents = {
  InteractionFlow,
  CadViewer,
  CadGroup,
  FrontendStudy,
  Section,
  Entry,
  Figure,
  FigurePair,
  Gallery,
  ImageGallery,
  BeforeAfter,
  ProblemChangeResult,
  Specs,
  CodeBlock,
  Attachments,
  Attachment,
  Video,
  VideoGroup,
  Status,
  Quote,
  pre: Pre,
};
