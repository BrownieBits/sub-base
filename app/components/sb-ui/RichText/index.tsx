import ContentfulImage from '@/components/sb-ui/ConentfulImage';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import Link from 'next/link';

const options = {
  renderMark: {
    [MARKS.CODE]: (text: any) => {
      return (
        <pre>
          <code>{text}</code>
        </pre>
      );
    },
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
      if (
        node.content.find((item: any) =>
          item.marks?.find((mark: any) => mark.type === 'code')
        )
      ) {
        return (
          <div>
            <pre>
              <code>{children}</code>
            </pre>
          </div>
        );
      }

      return <p>{children}</p>;
    },

    [INLINES.ENTRY_HYPERLINK]: (node: any) => {
      if (node.data.target.sys.contentType.sys.id === 'post') {
        return (
          <Link href={`/posts/${node.data.target.fields.slug}`}>
            {node.data.target.fields.title}
          </Link>
        );
      }
    },

    [INLINES.HYPERLINK]: (node: any) => {
      const text = node.content.find(
        (item: any) => item.nodeType === 'text'
      )?.value;
      return (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      );
    },

    [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
      if (node.data.target.sys.contentType.sys.id === 'videoEmbed') {
        return (
          <iframe
            height="400"
            width="100%"
            src={node.data.target.fields.embedUrl}
            title={node.data.target.fields.title}
            allowFullScreen={true}
          />
        );
      }
    },

    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      return (
        <ContentfulImage
          src={`https:${node.data.target.fields.file.url}`}
          height={node.data.target.fields.file.details.image.height}
          width={node.data.target.fields.file.details.image.width}
          alt={node.data.target.fields.title}
          // className="h-20 w-20"
        />
      );
    },
  },
};

const RichText = ({
  content,
  summary,
  maxChar,
}: {
  content: any;
  summary?: boolean;
  maxChar?: number;
}) => {
  if (summary) {
    const strings = content.content.map((item: any) => {
      if (item.nodeType === 'embedded-asset-block') {
        return;
      }
      return item.content[0].value;
    });
    if (maxChar) {
      return (
        <>
          {strings.join(' ').length < maxChar
            ? strings.join(' ')
            : `${strings.join(' ').substring(0, maxChar)}...`}
        </>
      );
    }
    return (
      <>
        {strings.join(' ').length < 256
          ? strings.join(' ')
          : `${strings.join(' ').substring(0, 256)}...`}
      </>
    );
  }
  return <>{documentToReactComponents(content, options)}</>;
};

export default RichText;
