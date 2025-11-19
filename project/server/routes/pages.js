import express from 'express';

// In-memory storage for pages (will be shared across requests)
let pages = [];

// Create pages router with access to journals array
export default function createPagesRouter(journals, requireAuth) {
  const router = express.Router();
  
  // POST create page
  router.post('/api/journals/:journalId/pages', requireAuth, (req, res) => {
    try {
      const journalId = parseInt(req.params.journalId);
      const userId = req.user?.id || req.user?.googleId;
      
      console.log('📝 POST /api/journals/:journalId/pages');
      console.log('📋 Journal ID:', journalId);
      console.log('👤 User ID:', userId);
      
      // Verify journal exists and belongs to user
      const journal = journals.find(j => j.id === journalId && j.userId === userId);
      if (!journal) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Journal not found'
        });
      }
      
      const {
        pageColor,
        pageBackgroundImage,
        prompt,
        images,
        stickers,
        textElements,
        doodle,
        spotifyUrl,
        metadata
      } = req.body;
      
      const newPage = {
        id: Date.now(),
        journalId: journalId,
        pageColor: pageColor || 'white',
        pageBackgroundImage: pageBackgroundImage || null,
        prompt: prompt || null,
        images: images || [],
        stickers: stickers || [],
        textElements: textElements || [],
        doodle: doodle || null,
        spotifyUrl: spotifyUrl || null,
        metadata: metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      pages.push(newPage);
      
      // Update journal page count
      journal.pageCount = (journal.pageCount || 0) + 1;
      
      console.log('✅ Page created:', newPage.id);
      console.log('📊 Total pages now:', pages.length);
      
      res.status(201).json(newPage);
    } catch (error) {
      console.error('❌ Error creating page:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create page'
      });
    }
  });

  // GET all pages for a journal
  router.get('/api/journals/:journalId/pages', requireAuth, (req, res) => {
    try {
      const journalId = parseInt(req.params.journalId);
      const userId = req.user?.id || req.user?.googleId;
      
      console.log('📚 GET /api/journals/:journalId/pages');
      console.log('📋 Journal ID:', journalId);
      
      // Verify journal exists and belongs to user
      const journal = journals.find(j => j.id === journalId && j.userId === userId);
      if (!journal) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Journal not found'
        });
      }
      
      const journalPages = pages.filter(p => p.journalId === journalId);
      
      console.log('✅ Found pages:', journalPages.length);
      res.json(journalPages);
    } catch (error) {
      console.error('❌ Error fetching pages:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch pages'
      });
    }
  });

  // GET single page by ID
  router.get('/api/journals/:journalId/pages/:pageId', requireAuth, (req, res) => {
    try {
      const journalId = parseInt(req.params.journalId);
      const pageId = parseInt(req.params.pageId);
      const userId = req.user?.id || req.user?.googleId;
      
      console.log('🔍 GET /api/journals/:journalId/pages/:pageId');
      console.log('📋 Journal ID:', journalId);
      console.log('📋 Page ID:', pageId);
      
      // Verify journal exists and belongs to user
      const journal = journals.find(j => j.id === journalId && j.userId === userId);
      if (!journal) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Journal not found'
        });
      }
      
      const page = pages.find(p => p.id === pageId && p.journalId === journalId);
      
      if (!page) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Page not found'
        });
      }
      
      console.log('✅ Found page:', page.id);
      res.json(page);
    } catch (error) {
      console.error('❌ Error fetching page:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch page'
      });
    }
  });

  // PUT update page
  router.put('/api/journals/:journalId/pages/:pageId', requireAuth, (req, res) => {
    try {
      const journalId = parseInt(req.params.journalId);
      const pageId = parseInt(req.params.pageId);
      const userId = req.user?.id || req.user?.googleId;
      
      console.log('✏️ PUT /api/journals/:journalId/pages/:pageId');
      console.log('📋 Journal ID:', journalId);
      console.log('📋 Page ID:', pageId);
      
      // Verify journal exists and belongs to user
      const journal = journals.find(j => j.id === journalId && j.userId === userId);
      if (!journal) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Journal not found'
        });
      }
      
      const pageIndex = pages.findIndex(p => p.id === pageId && p.journalId === journalId);
      
      if (pageIndex === -1) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Page not found'
        });
      }
      
      const {
        pageColor,
        pageBackgroundImage,
        prompt,
        images,
        stickers,
        textElements,
        doodle,
        spotifyUrl,
        metadata
      } = req.body;
      
      pages[pageIndex] = {
        ...pages[pageIndex],
        pageColor: pageColor || pages[pageIndex].pageColor,
        pageBackgroundImage: pageBackgroundImage !== undefined ? pageBackgroundImage : pages[pageIndex].pageBackgroundImage,
        prompt: prompt !== undefined ? prompt : pages[pageIndex].prompt,
        images: images !== undefined ? images : pages[pageIndex].images,
        stickers: stickers !== undefined ? stickers : pages[pageIndex].stickers,
        textElements: textElements !== undefined ? textElements : pages[pageIndex].textElements,
        doodle: doodle !== undefined ? doodle : pages[pageIndex].doodle,
        spotifyUrl: spotifyUrl !== undefined ? spotifyUrl : pages[pageIndex].spotifyUrl,
        metadata: metadata ? { ...pages[pageIndex].metadata, ...metadata } : pages[pageIndex].metadata,
        updatedAt: new Date().toISOString()
      };
      
      console.log('✅ Page updated:', pages[pageIndex].id);
      res.json(pages[pageIndex]);
    } catch (error) {
      console.error('❌ Error updating page:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update page'
      });
    }
  });

  // DELETE page
  router.delete('/api/journals/:journalId/pages/:pageId', requireAuth, (req, res) => {
    try {
      const journalId = parseInt(req.params.journalId);
      const pageId = parseInt(req.params.pageId);
      const userId = req.user?.id || req.user?.googleId;
      
      console.log('🗑️ DELETE /api/journals/:journalId/pages/:pageId');
      console.log('📋 Journal ID:', journalId);
      console.log('📋 Page ID:', pageId);
      
      // Verify journal exists and belongs to user
      const journal = journals.find(j => j.id === journalId && j.userId === userId);
      if (!journal) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Journal not found'
        });
      }
      
      const pageIndex = pages.findIndex(p => p.id === pageId && p.journalId === journalId);
      
      if (pageIndex === -1) {
        return res.status(404).json({
          error: 'Not found',
          message: 'Page not found'
        });
      }
      
      const deletedPage = pages[pageIndex];
      pages.splice(pageIndex, 1);
      
      // Update journal page count
      journal.pageCount = Math.max(0, (journal.pageCount || 1) - 1);
      
      console.log('✅ Page deleted:', deletedPage.id);
      res.json({ message: 'Page deleted successfully' });
    } catch (error) {
      console.error('❌ Error deleting page:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to delete page'
      });
    }
  });

  return router;
}

