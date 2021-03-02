/*STORED PROCEDURES ORDER MATCHES THE ORDER IN react > services > venueService.js*/

/* 1: GET Venue by ID */
/* 2: GET All Venues Paginated */
/* 3: POST Add Venue */
/* 4: PUT Update Venue */
/* 5: DELETE Remove Venue by ID */

/* 1: GET Venue by ID */

ALTER PROC [dbo].[Venues_Select_ById]
		@Id int
as

/*

	/* Last Modified
			By: Hugo Sanchez
			On: 2020-05-26
			Notes: Did not alter functionality, only test code was changed */

	DECLARE @Id int = 1

	EXECUTE dbo.Venues_Select_ById @Id
*/

BEGIN

SELECT [Id]
		, [Name]
		, [Description]
		, [LocationId]
		, [Url]
		, [CreatedBy]
		, [ModifiedBy]
		, [DateCreated]
		, [DateModified]

FROM dbo.Venues

WHERE Id = @Id

END

/* 2: GET All Venues Paginated */

ALTER PROC [dbo].[Venues_SelectAllPaginated_V2]
			@PageIndex int
			, @PageSize int

as

/*
		Declare @_PageIndex int = 0
				,@_PageSize int = 56
				
	EXECUTE [dbo].[Venues_SelectAllPaginated_V2]
				@_PageIndex
				,@_PageSize

	

	

*/

BEGIN

		DECLARE @Offset INT = @PageSize * @PageIndex

		SELECT DISTINCT V.[Id]
				,V.[Name]
				,V.[Description]
				,V.[LocationId]
				,l.LineOne
				,l.LineTwo
				,l.City 
				,l.zip
				,V.[Url]
				,V.[CreatedBy]
				,UP.FirstName
				,UP.LastName
				,V.[ModifiedBy]
				, P.FirstName
				, P.LastName
				,V.[DateCreated]
				,V.[DateModified]
			,[TotalCount] = COUNT(1) OVER()

			FROM [dbo].[Venues] as V
				JOIN dbo.UserProfiles as UP ON V.CreatedBy = UP.UserId
				JOIN dbo.Locations as l ON V.LocationId = l.Id
				JOIN dbo.UserProfiles as P ON V.ModifiedBy = P.UserId

			ORDER BY Id
			OFFSET @Offset ROWS
			FETCH NEXT @PageSize ROWS only

END

/* 3: POST Add Venue */

ALTER PROC [dbo].[Venues_Insert]
			@Name NVARCHAR(255)
           , @Description NVARCHAR(4000)
           , @LocationId INT
           , @Url NVARCHAR(255)
           , @CreatedBy INT
           , @ModifiedBy INT
		   , @Id INT OUTPUT
AS

/*
	/* Last Modified
			By: Hugo Sanchez
			On: 2020-05-26
			Notes: Did not alter functionality, only test code was changed */

	DECLARE @Id int = 0

	DECLARE 
		@Name NVARCHAR(255) = 'Disneyland'
		,@Description NVARCHAR(4000) = 'Happiest place on earth'
		,@LocationId INT = 5
		,@Url NVARCHAR(255) = 'https://disneyland.disney.go.com/'
		,@CreatedBy INT = '1'
		,@ModifiedBy INT = '1'


	EXECUTE dbo.Venues_Insert
		@Name
		,@Description
		,@LocationId
		,@Url
		,@CreatedBy
		,@ModifiedBy
		,@Id OUTPUT

	Execute dbo.Venues_Select_ById @Id
	Execute dbo.Venues_SelectAllPaginated 0 ,100

*/

BEGIN

	INSERT INTO [dbo].[Venues]
			   ([Name]
			   ,[Description]
			   ,[LocationId]
			   ,[Url]
			   ,[CreatedBy]
			   ,[ModifiedBy])
     VALUES
           (@Name
           , @Description
           , @LocationId
           , @Url
           , @CreatedBy
           , @ModifiedBy)

	SET @Id = SCOPE_IDENTITY()
	  
END

/* 4: PUT Update Venue */

ALTER PROC [dbo].[Venues_Update]

			@Name NVARCHAR(255)
           , @Description NVARCHAR(4000)
           , @LocationId INT
           , @Url NVARCHAR(255)
           , @ModifiedBy INT
		   , @Id INT 

AS

/* 

	/* Last Modified
		By: Hugo Sanchez
		On: 2020-05-26
		Notes: Did not alter functionality, only test code was changed,
			   along with spacing */

	DECLARE @Id int = 4

	DECLARE
			@Name NVARCHAR(255) = 'Mall of America'
           , @Description NVARCHAR(4000) = 'The largest shopping mall in north america'
           , @LocationId INT = 10
           , @Url NVARCHAR(255) = 'https://www.mallofamerica.com/'
           , @ModifiedBy INT = 456

	Execute dbo.Venues_Select_ById @Id

	EXECUTE dbo.Venues_Update
				@Name
			   , @Description
			   , @LocationId
			   , @Url
			   , @ModifiedBy
			   , @Id

	Execute dbo.Venues_Select_ById @Id

*/

BEGIN

	DECLARE @DateNow datetime2 = GETUTCDATE()

	UPDATE [dbo].[Venues]
	   SET [Name] = @Name
		  ,[Description] = @Description
		  ,[LocationId] = @LocationId
		  ,[Url] = @Url
		  ,[ModifiedBy] = @ModifiedBy
		  ,[DateModified] = @DateNow

	 WHERE Id = @Id

END

/* 5: DELETE Remove Venue by ID */

ALTER PROC [dbo].[Venues_Delete_ById]
			@Id INT
AS

/*


Declare @Id int = 10

SELECT *
FROM dbo.Venues
WHERE Id = @Id

EXECUTE dbo.Venues_Delete_ById @Id

SELECT *
FROM dbo.Venues
WHERE Id = @Id


*/

BEGIN 

DELETE FROM dbo.Venues
WHERE Id = @Id

END
