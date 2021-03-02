
/*STORED PROCEDURES ORDER MATCHES THE ORDER IN react > services > eventService.js*/

/*1: GET allEvents Paginated*/
/*2: PUT Update Event w/ Event Wizard */
/*3: POST Add Event -- Did not use in Production*/
/*4: POST Add Event Participants*/
/*5: DELETE Event Participants*/
/* 6: POST EventWizard ADD */
/* 7: DELETE Events */
/* 8: GET Events By Id */
/* 9: GET Event Details by ID */
/* 10: GET allEvents w/ Paginated Search */

/*1: GET allEvents Paginated*/

ALTER PROC [dbo].[Events_SelectAllPaginated] 

@PageIndex INT, 
@PageSize  INT, 
 @UserId INT

AS

/*

		DECLARE
		@_pageIndex int = 0
		,@_pageSize int = 20
		,@_userId int = 12

		Execute [dbo].[Events_SelectAllPaginated] 
			@_pageIndex  
			,@_pageSize 
			,@_userId

	-- Created on 09/07/2020 by Hugo Sanchez
	-- Copied from [dbo].[Events_SearchPaginated_V2] 

*/


    BEGIN
        SELECT E.[Id], 
               E.[Name], 
               E.[Summary], 
               E.[ShortDescription], 
               E.[ImageUrl], 
               E.[ExternalSiteUrl], 
               E.[IsFree], 
               E.[DateCreated], 
               E.[DateModified], 
               E.[DateStart], 
               E.[DateEnd], 
               E.[Capacity], 
               EP.[Price], 
			   EP.[StripeProductId],
			   EP.[StripePriceId],
			   EPP.[UserId] as ParticipantUserId, 
			   ET.[Id] AS EventTypeId,
               ET.[Name] AS EventTypeName, 
               V.Id AS VenueId, 
               V.[Name] AS VenueName, 
               V.[Description] AS VenueDescription, 
               V.[Url] AS VenueUrl, 
			   L.[Id],
               L.[LineOne], 
               L.[LineTwo], 
               L.[City], 
               L.[Zip], 
               L.[StateId], 
               S.[Name] AS StateName, 
               L.[Latitude], 
               L.[Longitude], 
			   L.[LocationTypeId],
               TotalCount = COUNT(1) OVER()
        FROM [dbo].[Events] AS E
             JOIN dbo.EventTypes AS ET ON ET.Id = E.EventTypeId
             JOIN dbo.Venues AS V ON V.Id = E.VenueId
             JOIN dbo.Locations AS L ON V.LocationId = L.Id
             JOIN dbo.LocationTypes AS Lt ON L.LocationTypeId = Lt.Id
             LEFT JOIN dbo.EventPrices AS EP ON EP.EventId = E.Id
			 LEFT JOIN dbo.EventParticipants AS EPP ON EPP.EventId = E.Id AND EPP.UserId = @UserId
             JOIN dbo.States AS S ON S.Id = L.StateId
        ORDER BY [DateStart] ASC
        OFFSET(@PageIndex) * (@PageSize) ROWS FETCH NEXT @PageSize ROWS ONLY;
    END;

	/*2: PUT Update w/ Event Wizard */

	ALTER proc [dbo].[EventWizard_Update]
	@EventTypeId      INT, 
	@Name        NVARCHAR(255), 
	@Summary          NVARCHAR(255), 
	@ShortDescription NVARCHAR(4000), 
	@EventStatusId    INT, 
	@ImageUrl         NVARCHAR(400), 
	@ExternalSiteUrl  NVARCHAR(400), 
	@IsFree           BIT, 
	@DateStart        DATETIME2(7), 
	@DateEnd          DATETIME2(7),
	@Price			decimal(6, 2),
	@Capacity			INT,
	--Location Params
	@LocationTypeId   INT, 
	@LocationLineOne          NVARCHAR(255), 
	@LocationLineTwo          NVARCHAR(255), 
	@LocationCity             NVARCHAR(255), 
	@LocationZip              NVARCHAR(255), 
	@LocationStateId          INT, 
	@LocationLatitude         FLOAT, 
	@LocationLongitude        FLOAT,
	--Venue Params
    @VenueId          INT,
	@VenueName        NVARCHAR(255), 
	@VenueDescription NVARCHAR(4000), 
	@VenueLocationId INT,
	@VenueUrl         NVARCHAR(255),
	--User Params
	@UserId           INT,
		--Stripe Params
	@StripeProductId NVARCHAR(MAX) = null,
	@StripePriceId NVARCHAR(MAX) = null,
	--EventId
	@EventId INT


AS

/* 
	Declare @EventTypeId      INT = 7, 
	@Name        NVARCHAR(255) = 'ValoreCare Meetup Updated', 
	@Summary          NVARCHAR(255) = 'Weekly ValoreCare Meetup' , 
	@ShortDescription NVARCHAR(4000) = 'Meetup with your favorite providers and network.', 
	@EventStatusId    INT = 1, 
	@ImageUrl         NVARCHAR(400) = 'https://c8.alamy.com/comp/EPF1YW/nun-with-handgun-isolated-on-white-EPF1YW.jpg', 
	@ExternalSiteUrl  NVARCHAR(400) = 'https://google.com', 
	@IsFree           BIT = 1,
	@DateStart        DATETIME2(7) = GETUTCDATE(), 
	@DateEnd          DATETIME2(7) = GETUTCDATE(),
	@Price			decimal(6, 2) = 0,
	@Capacity			INT = NULL,
	--Location Params
	@LocationTypeId   INT = 2, 
	@LocationLineOne          NVARCHAR(255) = '23285 pleasant valley road',
	@LocationLineTwo          NVARCHAR(255) = '', 
	@LocationCity             NVARCHAR(255) = 'creal springs',
	@LocationZip              NVARCHAR(255) = '62922',
	@LocationStateId          INT = 14, 
	@LocationLatitude         FLOAT = 37.6145, 
	@LocationLongitude        FLOAT = -88.731084,
	--Venue Params
    @VenueId          INT = 83,
	@VenueName        NVARCHAR(255) = 'Scotts House', 
	@VenueDescription NVARCHAR(4000) = 'Its a happening place', 
	@VenueLocationId INT = 172,
	@VenueUrl         NVARCHAR(255) = 'https://google.com',
	--User Params
	@UserId           INT = 8,
		--Stripe Params
	@StripeProductId NVARCHAR(MAX) = 'ValoreEvents_test',
	@StripePriceId NVARCHAR(MAX) = 'test123',
	--EventId
	@EventId int = 121


	
			

EXEC [dbo].[EventWizard_Update]
	@EventTypeId, 
	@Name, 
	@Summary, 
	@ShortDescription, 
	@EventStatusId, 
	@ImageUrl, 
	@ExternalSiteUrl, 
	@IsFree, 
	@DateStart, 
	@DateEnd,
	@Price,
	@Capacity,
	--Location Params
	@LocationTypeId, 
	@LocationLineOne, 
	@LocationLineTwo, 
	@LocationCity, 
	@LocationZip, 
	@LocationStateId, 
	@LocationLatitude, 
	@LocationLongitude,
	--Venue Params
    @VenueId,
	@VenueName, 
	@VenueDescription, 
	@VenueLocationId,
	@VenueUrl,
	--User Params
	@UserId,
	-- Stripe Params
	@StripeProductId,
	@StripePriceId,
		--final output eventId
	@EventId
			
			

EXEC [dbo].[Events_SelectDetails_ById_V3]
	@EventId,
	@UserId

*/

BEGIN
SET XACT_ABORT ON
Declare @Tran nvarchar(50)  = '_eventWizardInsertTx'

/*1)Declare Table Variable. INSERT INTO Table Variable( Select by Id)
2) IF(Table variable IS NULL) BEGIN  END  ELSE BEGIN END*/

BEGIN TRY

BEGIN Transaction @Tran


		EXEC [dbo].[Locations_Update]
			@VenueLocationId
			,@LocationTypeId
			,@LocationLineOne
			,@LocationLineTwo
			,@LocationCity
			,@LocationZip
			,@LocationStateId
			,@LocationLatitude
			,@LocationLongitude
			,@UserId
	

		EXEC [dbo].[Venues_Update]
			@VenueName
           ,@VenueDescription
           ,@VenueLocationId
           ,@VenueUrl
           ,@UserId
		   ,@VenueId 
		

	 EXEC [dbo].[Events_Update_V3] 
			@EventTypeId
			,@Name
			,@Summary
			,@ShortDescription
			,@VenueId
			,@EventStatusId
			,@ImageUrl
			,@ExternalSiteUrl
			,@IsFree
			,@DateStart
			,@DateEnd
			,@Capacity
			,@EventId



Commit Transaction @Tran

END TRY
BEGIN Catch



    IF (XACT_STATE()) = -1
    BEGIN
        PRINT 'The transaction is in an uncommittable state.' +
              ' Rolling back transaction.'
        ROLLBACK TRANSACTION @Tran;;
    END;

    -- Test whether the transaction is active and valid.
    IF (XACT_STATE()) = 1
    BEGIN
        PRINT 'The transaction is committable.' +
              ' Committing transaction.'
        COMMIT TRANSACTION @Tran;;
    END;

        -- If you want to see error info
       -- SELECT
        --ERROR_NUMBER() AS ErrorNumber,
        --ERROR_SEVERITY() AS ErrorSeverity,
        --ERROR_STATE() AS ErrorState,
       -- ERROR_PROCEDURE() AS ErrorProcedure,
       -- ERROR_LINE() AS ErrorLine,
       -- ERROR_MESSAGE() AS ErrorMessage

-- to just get the error thrown and see the bad news as an exception
    THROW

End Catch




SET XACT_ABORT OFF
END

/*3: POST Add Event*/

ALTER proc [dbo].[Events_Insert]

           @EventTypeId int
           ,@Name nvarchar(255)
           ,@Summary nvarchar(255)
           ,@ShortDescription nvarchar(4000)
           ,@VenueId int
           ,@EventStatusId int
           ,@ImageUrl nvarchar(400)
           ,@ExternalSiteUrl nvarchar(400)
           ,@IsFree bit
           ,@DateStart datetime2(7)
           ,@DateEnd datetime2(7)
			,@Id int OUTPUT


/*

	Declare @Id int = 0;

	Declare 
			@EventTypeId int = ''
			,@Name nvarchar(255) = ''
			,@Summary nvarchar(255) = ''
			,@ShortDescription nvarchar(4000) = ''
			,@VenueId int = ''
			,@EventStatusId int = ''
			,@ImageUrl nvarchar(400) = ''
			,@ExternalSiteUrl nvarchar(400) = ''
			,@IsFree bit = ''
			,@DateStart datetime2(7) = ''
			,@DateEnd datetime2(7) = ''

	Execute dbo.Events_Insert	
			@EventTypeId
			,@Name
			,@Summary
			,@ShortDescription
			,@VenueId
			,@EventStatusId
			,@ImageUrl
			,@ExternalSiteUrl
			,@IsFree
			,@DateStart
			,@DateEnd
			,@Id OUTPUT

	Select @id

	Select *
	From dbo.Events
	Where Id = @Id

*/

as

Begin

INSERT INTO [dbo].[Events]
           ([EventTypeId]
           ,[Name]
           ,[Summary]
           ,[ShortDescription]
           ,[VenueId]
           ,[EventStatusId]
           ,[ImageUrl]
           ,[ExternalSiteUrl]
           ,[IsFree]
           ,[DateStart]
           ,[DateEnd])
     VALUES
           (@EventTypeId
           ,@Name
           ,@Summary
           ,@ShortDescription
           ,@VenueId
           ,@EventStatusId
           ,@ImageUrl
           ,@ExternalSiteUrl
           ,@IsFree
           ,@DateStart
           ,@DateEnd)
	SET @Id = SCOPE_IDENTITY()

END

/*4: POST Add Event Participants*/

ALTER PROC [dbo].[EventParticipants_Insert]
@EventId int,
@UserId int,
@ParticipantTypeId int,
@Id int OUTPUT


AS

/* --Test--

EXEC [dbo].[EventParticipants_Insert]
108,
58,
2

*/

BEGIN


INSERT INTO [dbo].[EventParticipants]
           ([EventId]
           ,[UserId]
           ,[ParticipantTypeId])
     VALUES
           (@EventId
           ,@UserId
           ,@ParticipantTypeId)

		   set @Id = SCOPE_IDENTITY()
END

/*5: DELETE Event Participants*/

ALTER PROC [dbo].[EventParticipants_Delete]
@EventId int,
@UserId int



AS

/* --Test--

EXEC [dbo].[EventParticipants_Delete]
108,
58

*/

BEGIN

DELETE FROM [dbo].[EventParticipants]
WHERE [EventId] = @EventId AND [UserId] = @UserId

END

/* 6: POST EventWizard ADD */

ALTER proc [dbo].[EventWizard_Insert]
	@EventTypeId      INT, 
	@Name        NVARCHAR(255), 
	@Summary          NVARCHAR(255), 
	@ShortDescription NVARCHAR(4000), 
	@EventStatusId    INT, 
	@ImageUrl         NVARCHAR(400), 
	@ExternalSiteUrl  NVARCHAR(400), 
	@IsFree           BIT, 
	@DateStart        DATETIME2(7), 
	@DateEnd          DATETIME2(7),
	@Price			decimal(6, 2),
	@Capacity			INT,
	--Location Params
	@LocationTypeId   INT, 
	@LocationLineOne          NVARCHAR(255), 
	@LocationLineTwo          NVARCHAR(255), 
	@LocationCity             NVARCHAR(255), 
	@LocationZip              NVARCHAR(255), 
	@LocationStateId          INT, 
	@LocationLatitude         FLOAT, 
	@LocationLongitude        FLOAT,
	--Venue Params
    @VenueId          INT,
	@VenueName        NVARCHAR(255), 
	@VenueDescription NVARCHAR(4000), 
	@VenueLocationId INT,
	@VenueUrl         NVARCHAR(255),
	--User Params
	@UserId           INT,
		--Stripe Params
	@StripeProductId NVARCHAR(MAX) = null,
	@StripePriceId NVARCHAR(MAX) = null,
		--final output eventId
	@OutputId         INT OUTPUT


AS

/* 
	Declare @EventTypeId      INT = 7, 
	@Name        NVARCHAR(255) = 'ValoreCare Meetup', 
	@Summary          NVARCHAR(255) = 'Weekly ValoreCare Meetup' , 
	@ShortDescription NVARCHAR(4000) = 'Meetup with your favorite providers and network.', 
	@EventStatusId    INT = 1, 
	@ImageUrl         NVARCHAR(400) = 'https://c8.alamy.com/comp/EPF1YW/nun-with-handgun-isolated-on-white-EPF1YW.jpg', 
	@ExternalSiteUrl  NVARCHAR(400) = 'https://google.com', 
	@IsFree           BIT = 1,
	@DateStart        DATETIME2(7) = GETUTCDATE(), 
	@DateEnd          DATETIME2(7) = GETUTCDATE(),
	@Price			decimal(6, 2) = 0,
	@Capacity			INT = NULL,
	--Location Params
	@LocationTypeId   INT = 2, 
	@LocationLineOne          NVARCHAR(255) = '23285 pleasant valley road',
	@LocationLineTwo          NVARCHAR(255) = '', 
	@LocationCity             NVARCHAR(255) = 'creal springs',
	@LocationZip              NVARCHAR(255) = '62922',
	@LocationStateId          INT = 14, 
	@LocationLatitude         FLOAT = 37.6145, 
	@LocationLongitude        FLOAT = -88.731084,
	--Venue Params
    @VenueId          INT = 0,
	@VenueName        NVARCHAR(255) = 'Scotts House', 
	@VenueDescription NVARCHAR(4000) = 'Its a happening place', 
	@VenueLocationId INT = 0,
	@VenueUrl         NVARCHAR(255) = 'https://google.com',
	--User Params
	@UserId           INT = 8,
		--Stripe Params
	@StripeProductId NVARCHAR(MAX) = 'ValoreEvents_test',
	@StripePriceId NVARCHAR(MAX) = 'test123',
		--final output eventId
	@OutputId         INT

	
			

EXEC [dbo].[EventWizard_Insert]
	@EventTypeId, 
	@Name, 
	@Summary, 
	@ShortDescription, 
	@EventStatusId, 
	@ImageUrl, 
	@ExternalSiteUrl, 
	@IsFree, 
	@DateStart, 
	@DateEnd,
	@Price,
	@Capacity,
	--Location Params
	@LocationTypeId, 
	@LocationLineOne, 
	@LocationLineTwo, 
	@LocationCity, 
	@LocationZip, 
	@LocationStateId, 
	@LocationLatitude, 
	@LocationLongitude,
	--Venue Params
    @VenueId,
	@VenueName, 
	@VenueDescription, 
	@VenueLocationId,
	@VenueUrl,
	--User Params
	@UserId,
	-- Stripe Params
	@StripeProductId,
	@StripePriceId,
		--final output eventId
	@OutputId OUTPUT
			
			

EXEC [dbo].[Events_SelectDetails_ById_V3]
	@OutputId

*/

BEGIN
SET XACT_ABORT ON
Declare @Tran nvarchar(50)  = '_eventWizardInsertTx'

/*1)Declare Table Variable. INSERT INTO Table Variable( Select by Id)
2) IF(Table variable IS NULL) BEGIN  END  ELSE BEGIN END*/

BEGIN TRY

BEGIN Transaction @Tran
	
		IF(@VenueLocationId = 0)	
		BEGIN
		  EXEC [dbo].[Locations_Insert] 
             @VenueLocationId OUTPUT, 
             @LocationTypeId, 
             @LocationLineOne, 
             @LocationLineTwo, 
             @LocationCity, 
             @LocationZip, 
             @LocationStateId, 
             @LocationLatitude, 
             @LocationLongitude, 
             @UserId;
		END

		IF(@VenueId = 0)
		BEGIN
		 EXEC [dbo].[Venues_Insert] 
             @VenueName, 
             @VenueDescription, 
             @VenueLocationId, 
             @VenueUrl, 
             @UserId, 
             @UserId, 
             @VenueId OUTPUT;
		END

		IF(@VenueId != 0 AND @VenueLocationId != 0)
		BEGIN
		      EXEC [dbo].[Events_InsertV3] 
			   @EventTypeId, 
             @Name, 
             @Summary, 
             @ShortDescription, 
             @VenueId, 
             @EventStatusId, 
             @ImageUrl, 
             @ExternalSiteUrl, 
             @IsFree, 
             @DateStart, 
             @DateEnd, 
			 @Capacity,
             @OutputId OUTPUT;
		END

		IF(@Price > 0)
		BEGIN
			EXEC [dbo].[EventPrices_Insert]
			@OutputId,
			2,
			@Price,
			@StripeProductId,
			@StripePriceId
		END


Commit Transaction @Tran

END TRY
BEGIN Catch



    IF (XACT_STATE()) = -1
    BEGIN
        PRINT 'The transaction is in an uncommittable state.' +
              ' Rolling back transaction.'
        ROLLBACK TRANSACTION @Tran;;
    END;

    -- Test whether the transaction is active and valid.
    IF (XACT_STATE()) = 1
    BEGIN
        PRINT 'The transaction is committable.' +
              ' Committing transaction.'
        COMMIT TRANSACTION @Tran;;
    END;

        -- If you want to see error info
       -- SELECT
        --ERROR_NUMBER() AS ErrorNumber,
        --ERROR_SEVERITY() AS ErrorSeverity,
        --ERROR_STATE() AS ErrorState,
       -- ERROR_PROCEDURE() AS ErrorProcedure,
       -- ERROR_LINE() AS ErrorLine,
       -- ERROR_MESSAGE() AS ErrorMessage

-- to just get the error thrown and see the bad news as an exception
    THROW

End Catch




SET XACT_ABORT OFF
END

/* 7: DELETE Events */

ALTER proc [dbo].[Events_Delete]
		@Id int

/*

	Declare @Id int = 8;

	Select *
	from dbo.Events
	WHERE Id = @Id;

	Execute dbo.Events_Delete @Id

	Select *
	from dbo.Events
	WHERE Id = @Id;


*/

AS

BEGIN

SET XACT_ABORT ON
Declare @Tran nvarchar(50)  = '_deleteEvent'

BEGIN TRY

BEGIN Transaction @Tran

	EXEC [dbo].[EventPrices_Delete] 
	@Id,
	2

	EXEC [dbo].[EventParticipants_DeleteByEvent]
	@Id

	DELETE FROM [dbo].[Events]
    WHERE Id = @Id;

Commit Transaction @Tran

END TRY
BEGIN Catch



    IF (XACT_STATE()) = -1
    BEGIN
        PRINT 'The transaction is in an uncommittable state.' +
              ' Rolling back transaction.'
        ROLLBACK TRANSACTION @Tran;;
    END;

    -- Test whether the transaction is active and valid.
    IF (XACT_STATE()) = 1
    BEGIN
        PRINT 'The transaction is committable.' +
              ' Committing transaction.'
        COMMIT TRANSACTION @Tran;;
    END;

        -- If you want to see error info
       -- SELECT
        --ERROR_NUMBER() AS ErrorNumber,
        --ERROR_SEVERITY() AS ErrorSeverity,
        --ERROR_STATE() AS ErrorState,
       -- ERROR_PROCEDURE() AS ErrorProcedure,
       -- ERROR_LINE() AS ErrorLine,
       -- ERROR_MESSAGE() AS ErrorMessage

-- to just get the error thrown and see the bad news as an exception
    THROW

End Catch




SET XACT_ABORT OFF



END

/* 8: GET Event By Id */

ALTER proc [dbo].[Events_SelectById]
	@Id int

/*

	Declare @Id int = 13

	Execute dbo.Events_SelectById @Id
*/

AS

BEGIN

	SELECT [Id]
		  ,[EventTypeId]
		  ,[Name]
		  ,[Summary]
		  ,[ShortDescription]
		  ,[VenueId]
		  ,[EventStatusId]
		  ,[ImageUrl]
		  ,[ExternalSiteUrl]
		  ,[IsFree]
		  ,[DateCreated]
		  ,[DateModified]
		  ,[DateStart]
		  ,[DateEnd]
	  FROM [dbo].[Events]
	  Where Id = @Id
END

/* 9: GET Event Details by ID */

ALTER PROC [dbo].[Events_SelectDetails_ById_V3]

@Id INT,
@UserId INT

AS

/* 

DECLARE @_Id int = 13


EXEC [dbo].[Events_SelectDetails_ById_V3]
	@_Id

*/

    BEGIN
        SELECT E.[Id], 
               E.[Name], 
               E.[Summary], 
               E.[ShortDescription], 
               E.[ImageUrl], 
               E.[ExternalSiteUrl], 
               E.[IsFree], 
               E.[DateCreated], 
               E.[DateModified], 
               E.[DateStart], 
               E.[DateEnd], 
               E.[Capacity], 
               EP.[Price], 
			   EP.[StripeProductId],
			   EP.[StripePriceId],
			   EPP.[UserId] as ParticipantUserId, 
			   ET.[Id] AS EventTypeId,
               ET.[Name] AS EventTypeName, 
               V.Id AS VenueId, 
               V.[Name] AS VenueName, 
               V.[Description] AS VenueDescription, 
               V.[Url] AS VenueUrl, 
			   L.[Id],
               L.[LineOne], 
               L.[LineTwo], 
               L.[City], 
               L.[Zip], 
               L.[StateId], 
               S.[Name] AS StateName, 
               L.[Latitude], 
               L.[Longitude], 
			   L.[LocationTypeId],
               TotalCount = COUNT(1) OVER()
        FROM [dbo].[Events] AS E
             JOIN dbo.EventTypes AS ET ON ET.Id = E.EventTypeId
             JOIN dbo.Venues AS V ON V.Id = E.VenueId
             JOIN dbo.Locations AS L ON V.LocationId = L.Id
             JOIN dbo.LocationTypes AS Lt ON L.LocationTypeId = Lt.Id
             LEFT JOIN dbo.EventPrices AS EP ON EP.EventId = E.Id
			 LEFT JOIN dbo.EventParticipants AS EPP ON EPP.EventId = E.Id AND EPP.UserId = @UserId
             JOIN dbo.States AS S ON S.Id = L.StateId
        WHERE E.[Id] = @Id
    END;

	/* 10: GET Events w/ Paginated Search */

	ALTER PROC [dbo].[Events_SearchPaginated_V2] @PageIndex INT, 
                                             @PageSize  INT, 
											 @UserId INT,
                                             @Query     NVARCHAR(100)

/*


		DECLARE
		@_pageIndex int = 0
		,@_pageSize int = 20
		,@_userId int = 58
		,@_query nvarchar(100) = 'w'

		Execute [dbo].[Events_SearchPaginated_V2]
			@_pageIndex  
			,@_pageSize 
			,@_userId
			,@_query
					


*/

AS
    BEGIN
        SELECT E.[Id], 
               E.[Name], 
               E.[Summary], 
               E.[ShortDescription], 
               E.[ImageUrl], 
               E.[ExternalSiteUrl], 
               E.[IsFree], 
               E.[DateCreated], 
               E.[DateModified], 
               E.[DateStart], 
               E.[DateEnd], 
               E.[Capacity], 
               EP.[Price], 
			   EP.[StripeProductId],
			   EP.[StripePriceId],
			   EPP.[UserId] as ParticipantUserId, 
			   ET.[Id] AS EventTypeId,
               ET.[Name] AS EventTypeName, 
               V.Id AS VenueId, 
               V.[Name] AS VenueName, 
               V.[Description] AS VenueDescription, 
               V.[Url] AS VenueUrl, 
			   L.[Id],
               L.[LineOne], 
               L.[LineTwo], 
               L.[City], 
               L.[Zip], 
               L.[StateId], 
               S.[Name] AS StateName, 
               L.[Latitude], 
               L.[Longitude], 
			   L.[LocationTypeId],
               TotalCount = COUNT(1) OVER()
        FROM [dbo].[Events] AS E
             JOIN dbo.EventTypes AS ET ON ET.Id = E.EventTypeId
             JOIN dbo.Venues AS V ON V.Id = E.VenueId
             JOIN dbo.Locations AS L ON V.LocationId = L.Id
             JOIN dbo.LocationTypes AS Lt ON L.LocationTypeId = Lt.Id
             LEFT JOIN dbo.EventPrices AS EP ON EP.EventId = E.Id
			 LEFT JOIN dbo.EventParticipants AS EPP ON EPP.EventId = E.Id AND EPP.UserId = @UserId
             JOIN dbo.States AS S ON S.Id = L.StateId
        WHERE(E.[EventStatusId] = 1
              AND (E.[Name] LIKE '%' + @Query + '%'
                   OR E.[Summary] LIKE '%' + @Query + '%'
                   OR E.[ShortDescription] LIKE '%' + @Query + '%'
                   OR V.[Name] LIKE '%' + @Query + '%'
                   OR V.[Description] LIKE '%' + @Query + '%'
                   OR L.[City] LIKE '%' + @Query + '%'
                   OR L.[Zip] LIKE '%' + @Query + '%'
                   OR ET.[Name] LIKE '%' + @Query + '%'))
        ORDER BY [DateStart] ASC
        OFFSET(@PageIndex) * (@PageSize) ROWS FETCH NEXT @PageSize ROWS ONLY;
    END;