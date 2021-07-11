module SavePoint exposing 
    ( SavePointAppearance(..), SavePoint
    , init, view, update, defSaveBox
    )

import Array exposing (Array)
import GlobalBasics
import MainType
import Maybe exposing (withDefault)
import Player
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import ViewMove

type SavePointAppearance
    = Saved
    | Unsaved

type alias SavePoint =
    { pos : GlobalBasics.Pos
    , collisionBox : GlobalBasics.CollisionBox
    , appearance : SavePointAppearance
    }

{-| savePointWidth Constant
-}
savePointWidth : Float
savePointWidth =
    Tuple.first GlobalBasics.blockSize


{-| savePointHeight Constant
-}
savePointHeight : Float
savePointHeight =
    Tuple.second GlobalBasics.blockSize

{-| DefaultSavePoint used with withDefault
-}
defSavePoint : SavePoint
defSavePoint =
    init ( 0, 0 )

defSaveBox : GlobalBasics.CollisionBox
defSaveBox =
    GlobalBasics.Polygon
        (Array.fromList
            [ ( ( 0.0, 0.0 ), ( savePointWidth, 0.0 ) )
            , ( ( savePointWidth, 0.0 ), ( savePointWidth, savePointHeight ) )
            , ( ( savePointWidth, savePointHeight ), ( 0.0, savePointHeight ) )
            , ( ( 0.0, savePointHeight ), ( 0.0, 0.0 ) )
            ]
        )

init: ( Float, Float ) -> SavePoint
init ( x, y ) =
    { pos = ( x, y )
    , collisionBox = defSaveBox
    , appearance = Unsaved
    }

{-| view one savePoint, used in view, not exposed.
-}
viewOneSavePoint : { model | windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> SavePoint -> List (Svg MainType.Msg)
viewOneSavePoint model savePoint =
    let
        ( savePointX, savePointY ) =
            savePoint.pos
        saveOpacity = 
            if savePoint.appearance == Saved then
                1
            else
                0.5
    in
    [ Svg.rect
        [ SvgAttr.x (String.fromFloat (ViewMove.deltaX model + savePointX))
        , SvgAttr.y (String.fromFloat (ViewMove.deltaY model + savePointY))
        , SvgAttr.width (String.fromFloat savePointWidth)
        , SvgAttr.height (String.fromFloat savePointHeight)
        , SvgAttr.strokeWidth "2"
        , SvgAttr.stroke "#000000"
        , SvgAttr.fill "#00000050"
        , SvgAttr.opacity (String.fromFloat saveOpacity)
        ]
        []
    ]

{-| view function of savePoint
-}
view : { model | savePoints: Array SavePoint, windowBoundary : GlobalBasics.Pos, levelBoundary : GlobalBasics.Pos, player : Player.Player } -> List (Svg MainType.Msg)
view model =
    let
        savePointsList =
            Array.toList model.savePoints

        svgSavePointListList =
            List.map (\brick -> viewOneSavePoint model brick) savePointsList
    in
    List.concat svgSavePointListList

updateOneSavePoint : Int -> { model | player : Player.Player, savePoints : Array SavePoint } -> { model | player : Player.Player, savePoints : Array SavePoint }
updateOneSavePoint id model =
    let
        savePoint = 
            Array.get id model.savePoints
                |> withDefault defSavePoint
        newPoint = { savePoint | appearance = Saved }
        newPoints = Array.set id newPoint model.savePoints
        oldPlayer = model.player
        newPlayer = { oldPlayer | saveNumber = oldPlayer.saveNumber + 1 }
        newModel = { model | savePoints = newPoints , player = newPlayer}
        status = Player.playerIfCollidePoly model savePoint
    in
    if status == GlobalBasics.Collided && savePoint.appearance == Unsaved then
        newModel
    else
        model

update : ( { model | player : Player.Player, savePoints : Array SavePoint }, Cmd MainType.Msg ) -> ( { model | player : Player.Player, savePoints : Array SavePoint }, Cmd MainType.Msg )
update ( model, cmd ) =
    ( List.foldl updateOneSavePoint model (List.range 0 (Array.length model.savePoints - 1)), cmd )