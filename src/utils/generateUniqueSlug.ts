import { Model } from 'mongoose';

const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word characters except space and dash
    .replace(/\s+/g, '-') // replace spaces with dashes
    .replace(/--+/g, '-') // replace multiple dashes with one
    .replace(/^-+|-+$/g, ''); // trim leading and trailing dashes
};

export const generateUniqueSlug = async (
  title: string,
  model: Model<any>,
  field = 'slug',
) => {
  const baseSlug = generateSlugFromTitle(title);
  let slug = baseSlug;
  let count = 1;

  while (await model.exists({ [field]: slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};
