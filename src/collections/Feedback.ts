import type { CollectionConfig } from 'payload'

export const Feedback: CollectionConfig = {
  slug: 'Feedback',
  fields: [
    {
      name: 'Client Name',
      type: 'text',
    },
    {
      name: 'Client Feedback',
      type: 'text',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}

export default Feedback
