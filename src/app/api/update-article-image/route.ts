import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { slug, imageUrl } = await req.json();

    if (!slug || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: slug and imageUrl' },
        { status: 400 }
      );
    }

    // Validate that the image URL is properly formatted
    try {
      new URL(imageUrl);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid image URL format' },
        { status: 400 }
      );
    }

    // Find the article by slug
    const article = await prisma.article.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        featuredImage: true,
        slug: true
      }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Update the article with the new image
    const updatedArticle = await prisma.article.update({
      where: { slug },
      data: {
        featuredImage: imageUrl,
        updatedAt: new Date()
      },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        updatedAt: true
      }
    });

    // Log the update for tracking
    console.log(`[Article Image Update] Updated "${article.title}"`);
    console.log(`  Old image: ${article.featuredImage}`);
    console.log(`  New image: ${imageUrl}`);

    return NextResponse.json({
      success: true,
      message: 'Article image updated successfully',
      article: {
        id: updatedArticle.id,
        title: updatedArticle.title,
        slug: updatedArticle.slug,
        oldImage: article.featuredImage,
        newImage: updatedArticle.featuredImage,
        updatedAt: updatedArticle.updatedAt
      }
    });

  } catch (error) {
    console.error('[Update Article Image] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update article image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}