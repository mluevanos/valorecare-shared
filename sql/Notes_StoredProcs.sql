/*STORED PROCEDURES ORDER MATCHES THE ORDER IN react > services > noteService.js*/

/* 1: GET Search Notes by Seeker */
/* 2: GET Search Notes by Provider */
/* 3: GET Notes By Seeker ID */
/* 4: GET Note by ID */
/* 5: GET Notes by Created By */
/* 6: GET List of Seeker Names */
/* 7: ADD Note */
/* 8: PUT Update Note by ID */
/* 9: DELETE Note by ID */

/* 1: GET Search Notes by Seeker */

ALTER PROC [dbo].[Notes_SearchBySeekerNameV2]
	@ProviderId INT,
	@SearchQ NVARCHAR(100),
	@PageIndex INT,
	@PageSize INT

AS

/*

DECLARE @ProviderId INT = 2,
		@SearchQ NVARCHAR(100) = 'a',
		@PageIndex INT = 0,
		@PageSize INT = 10

EXECUTE [dbo].[Notes_SearchBySeekerNameV2] @ProviderId,
	@SearchQ,
	@PageIndex,
	@PageSize

*/

BEGIN 

	DECLARE @Offset INT = @PageIndex * @PageSize

	SELECT   N.Id
			, [SeekerFirstName] = Upr.[FirstName]
			, [SeekerLastName] = Upr.[LastName]
			, N.CreatedBy
			, N.Notes
			, N.TagId
			, N.DateCreated
			, [TotalCount] = COUNT(1) OVER()

	FROM dbo.Notes AS N
	INNER JOIN dbo.UserProfiles AS Upr
	ON N.SeekerId = Upr.UserId
	
	WHERE CreatedBy = @ProviderId
	AND (Upr.[FirstName] Like '%' + @SearchQ + '%'
		OR Upr.[LastName] LIKE '%' +  @SearchQ + '%')

	ORDER BY N.DateCreated

	OFFSET @Offset ROWS
	FETCH NEXT @PageSize ROWS ONLY


END

/* 2: GET Search Notes by Provider */

ALTER PROC [dbo].[Notes_SearchByProviderName]
	@SeekerId INT,
	@SearchQ NVARCHAR(100),
	@PageIndex INT,
	@PageSize INT

AS

/*
DECLARE @SeekerId INT = 2,
		@SearchQ NVARCHAR(100) = 'a',
		@PageIndex INT = 0,
		@PageSize INT = 10

EXECUTE dbo.Notes_SearchByProviderName @SeekerId,
	@SearchQ,
	@PageIndex,
	@PageSize

*/

BEGIN

	DECLARE @Offset INT = @PageIndex * @PageSize

	SELECT N.Id
			, [ProviderFirstName] = Upr.[FirstName]
			, [ProviderLastName] = Upr.[LastName]
			, N.CreatedBy
			, N.Notes
			, N.TagId
			, N.DateCreated
			, [TotalCount] = COUNT(1) OVER()

		FROM dbo.Notes AS N
		JOIN dbo.UserProfiles AS Upr
		ON N.CreatedBy = Upr.UserId

		WHERE SeekerId = @SeekerId
		AND (Upr.[FirstName] Like '%' + @SearchQ + '%'
		OR Upr.[LastName] LIKE '%' +  @SearchQ + '%')

		ORDER BY N.DateCreated

		OFFSET @Offset ROWS
		FETCH NEXT @PageSize ROWS ONLY

END

/* 3: GET Notes By Seeker ID */

ALTER PROC [dbo].[Notes_Select_BySeekerId_V2]
	@SeekerId INT,
	@PageIndex INT,
	@PageSize INT

AS

/*
DECLARE @SeekerId INT = 2,
		@PageIndex INT = 0,
		@PageSize INT = 10

EXECUTE [dbo].[Notes_Select_BySeekerId_V2] @SeekerId,
	@PageIndex,
	@PageSize

*/

BEGIN

	DECLARE @Offset INT = @PageIndex * @PageSize

	SELECT N.Id
			, [ProviderFirstName] = Upr.[FirstName]
			, [ProviderLastName] = Upr.[LastName]
			, N.CreatedBy
			, N.Notes
			, N.TagId
			, N.DateCreated
			, [TotalCount] = COUNT(1) OVER()

		FROM dbo.Notes AS N
		JOIN dbo.UserProfiles AS Upr
		ON N.CreatedBy = Upr.UserId

		WHERE SeekerId = @SeekerId

		ORDER BY N.DateCreated

		OFFSET @Offset ROWS
		FETCH NEXT @PageSize ROWS ONLY

END

/* 4: GET Note by ID */

ALTER PROC [dbo].[Notes_SelectByIdV2]
			@Id INT

AS

/*

Declare @Id INT = 4

Execute dbo.Notes_SelectByIdV2
			@Id

*/

BEGIN

	SELECT   Id
			, Notes
			, SeekerId
			, TagId

	FROM dbo.Notes

	WHERE Id = @Id

END

/* 5: GET Notes by Created By */

ALTER PROC [dbo].[Notes_Select_ByCreatedBy_V2]
	     @CreatedBy INT
	   , @PageIndex INT
       , @PageSize  INT
	   
		
AS


/*

DECLARE   @CreatedBy int = 2
		, @PageIndex int = 0
		, @PageSize int = 10
		

EXECUTE [dbo].[Notes_Select_ByCreatedBy_V2]

		  @CreatedBy
		, @PageIndex
		, @PageSize
		

*/

BEGIN

DECLARE @Offset int = @PageSize * @PageIndex

SELECT N.[Id]
		, [SeekerFirstName] = Upr.[FirstName]
      , [SeekerLastName] = Upr.[LastName]
      , N.CreatedBy
      , N.Notes
	  , N.TagId
	  , N.DateCreated
	  ,[TotalCount] = COUNT(1) OVER()
  FROM [dbo].[Notes] AS N
  JOIN dbo.UserProfiles AS Upr
  ON N.SeekerId = Upr.UserId

  WHERE CreatedBy = @CreatedBy

  ORDER BY N.DateCreated

  OFFSET @Offset ROWS
  FETCH NEXT @PageSize ROWS ONLY


END


/* 6: GET List of Seeker Names */

ALTER PROC [dbo].[Appointments_GetSeekersNameBy_ProviderId]
		@ProviderId INT
		

AS

/*

DECLARE @ProviderId INT = 3

EXECUTE dbo.Appointments_GetSeekersNameBy_ProviderId
		@ProviderId


*/


BEGIN 

SELECT DISTINCT Apt.SeekerId as UserId
		, [SeekerFirstName] = Upr.[FirstName]
		, [SeekerLastName] = Upr.[LastName]

		FROM dbo.Appointments AS Apt
		JOIN dbo.UserProfiles as Upr
		ON Apt.SeekerId = Upr.UserId

		WHERE ProviderId = @ProviderId

		ORDER BY FirstName

END

/* 7: ADD Note */

ALTER PROC [dbo].[Notes_Insert]

		 @Notes nvarchar(1000)
	   , @SeekerId int
	   , @TagId int 
	   , @CreatedBy int 
	   , @Id int OUTPUT

AS

/*

DECLARE  @Notes nvarchar(1000) = 'Notes 6'
	   , @SeekerId int = 1
	   , @TagId int = 2
	   , @CreatedBy int = 4
	   , @Id int = 1

EXECUTE dbo.Notes_Insert
             @Notes
            ,@SeekerId
            ,@TagId
			,@CreatedBy
			,@Id OUTPUT
SELECT *
from Notes
WHERE Id = @Id


*/

BEGIN

	INSERT INTO [dbo].[Notes]
			   ([Notes]
			   ,[SeekerId]
			   ,[TagId]
			   ,[CreatedBy])
     VALUES
			   (@Notes
			   ,@SeekerId
			   ,@TagId
			   ,@CreatedBy)

	SET @Id = SCOPE_IDENTITY()

END

/* 8: PUT Update Note by ID */

ALTER PROC [dbo].[Notes_Update]
	
	     @Notes nvarchar(1000)
	   , @SeekerId int
	   , @TagId int
	   , @CreatedBy int 
	   , @Id int

AS

/*


DECLARE @Id int = 3

SELECT *
FROM Notes
WHERE Id = @Id

DECLARE  @Notes nvarchar(1000) = 'akjbvladfjb'
	   , @SeekerId int = 10
	   , @TagId int = 2
	   , @CreatedBy int = 4

EXECUTE dbo.Notes_Update 

        @Notes
      , @SeekerId
      , @TagId
	  , @CreatedBy 
	  , @Id

 SELECT *
 FROM Notes
 WHERE Id = @Id


*/

BEGIN

DECLARE @Datenow datetime2 = GETUTCDATE()

UPDATE [dbo].[Notes]
   SET [Notes] = @Notes
      ,[SeekerId] = @SeekerId
      ,[TagId] = @TagId
      ,[DateModified] = @Datenow
	  ,[CreatedBy] = @CreatedBy
 WHERE Id = @Id

END

/* 9: DELETE Note by ID */

ALTER PROC [dbo].[Notes_Delete_ById]
		@Id int

AS

/*
DECLARE @Id int = 14

SELECT *
FROM dbo.Notes
WHERE Id = @Id

EXECUTE dbo.Notes_Delete_ById @Id

SELECT *
FROM dbo.Notes
WHERE Id = @Id

*/

BEGIN

DELETE FROM [dbo].[Notes]
WHERE Id = @Id

END