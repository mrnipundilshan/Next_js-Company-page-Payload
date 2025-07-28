import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'Posts',
  fields: [
    {
      name: 'Project Name',
      type: 'text',
    },

    {
      name: 'Project Description',
      type: 'richText',
      // Pass the Lexical editor to the root config
      editor: lexicalEditor({}),
    },

    {
      name: 'backgroundImage', // required
      type: 'upload', // required
      relationTo: 'media', // required
      required: true,
    },
  ],
}

export default Posts
